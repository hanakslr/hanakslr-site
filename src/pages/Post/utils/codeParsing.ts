//// Parsing helper functions for codeblocks.

import { CodeSnippet } from "../components/MarkdownCodeComponent";

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
  commit: string = "main",
  filePath: string,
): Promise<string> {
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${commit}/${filePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.text();
}

export async function parseGitCodeBlock(
  content: string,
): Promise<CodeSnippet[]> {
  try {
    const { commit, repo, files } = JSON.parse(content);
    const [owner, repoName] = repo.split("/");

    const fetchPromises = files.map(
      async (file: {
        file: string;
        entryFile?: boolean;
        foldRanges?: [number, number][];
      }) => {
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
            entry: file.entryFile,
            title: commit && repo ? `${commit} | ${repo}` : undefined,
            foldRanges: file.foldRanges,
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

export const parseCodeBlock = (allLanguages: string, children: string) => {
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
