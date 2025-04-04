import { CodeDisplay } from "./CodeDisplay";
import { useState, useEffect, useMemo } from "react";

export interface CodeSnippet {
  name: string;
  language: string;
  code: string;
  title?: string;
}
function parseProperties(input: string): {
  properties: Record<string, string>;
  remainingText: string;
} {
  const regex = /^(#@(?:\w+=[^\n]*\n)*)\n?(.*)$/s; // Non-greedy property capture with correct stopping
  const match = input.match(regex);

  const properties: Record<string, string> = {};
  const remainingText = match ? match[2] : input; // The second group captures remaining text

  if (match && match[1]) {
    match[1]
      .trim()
      .split("\n")
      .forEach((line) => {
        const [, key, value] = line.match(/^#@(\w+)=(.*)$/) || [];
        if (key && value) {
          properties[key.trim()] = value.trim();
        }
      });
  }

  return { properties, remainingText };
}

async function fetchGitHubContent(
  owner: string,
  repo: string,
  commit: string,
  filePath: string,
): Promise<string> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${filePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

async function parseGitCodeBlock(content: string): Promise<CodeSnippet[]> {
  try {
    const { commit, repo, files } = JSON.parse(content);
    const [owner, repoName] = repo.split("/");

    const fetchPromises = files.map(
      async (file: { file: string; entryFile?: boolean }) => {
        try {
          const code = await fetchGitHubContent(
            owner,
            repoName,
            commit,
            file.file,
          );
          return {
            name: file.file,
            language: file.file.split(".").pop() || "plaintext",
            code,
            title: commit && repo ? `${commit} | ${repo}` : undefined,
          };
        } catch (error: any) {
          console.error(`Failed to fetch ${file.file}:`, error);
          return {
            name: file.file,
            language: file.file.split(".").pop() || "plaintext",
            code: `// Error loading file: ${error?.message}`,
            title: commit && repo ? `${commit} | ${repo}` : undefined,
          };
        }
      },
    );

    return Promise.all(fetchPromises);
  } catch (error) {
    console.error("Failed to parse GitHub code block:", error);
    return [
      {
        name: "Error",
        language: "plaintext",
        code: `// Error parsing GitHub code block: ${error}`,
        title: "Error",
      },
    ];
  }
}

const parseCodeBlock = (allLanguages: string, children: string) => {
  const languages = allLanguages.split("|"); // Use `|` to separate languages
  const snippets: CodeSnippet[] = children
    .trim()
    .split("\n\n---\n\n")
    .map((code: string, i: number) => {
      const { properties, remainingText } = parseProperties(code);

      return {
        language: languages[i] || "plaintext",
        code: remainingText,
        title: properties.title,
        name: properties.title || `File ${i + 1}`,
      };
    });

  return snippets;
};

export const CodeMarkdownComponent = ({
  className,
  children,
  inline,
  ...props
}: any) => {
  const match = /language-(\w+)/.exec(className || "");
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const language = match ? match[1] : null;

  // Memoize non-GitHub code parsing
  const parsedSnippets = useMemo(() => {
    if (!inline && language && language !== "github") {
      return parseCodeBlock(language, children);
    }
    return null;
  }, [inline, language, children]);

  // Only run effect for GitHub content
  useEffect(() => {
    if (!inline && language === "github") {
      parseGitCodeBlock(children).then(setSnippets);
    }
  }, [inline, language, children]);

  if (!inline && match) {
    return (
      <CodeDisplay
        snippets={language === "github" ? snippets : parsedSnippets || []}
      />
    );
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
