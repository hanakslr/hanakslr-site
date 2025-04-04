import { useState, useEffect, useMemo } from "react";
import {
  CodeSnippet,
  parseCodeBlock,
  parseGitCodeBlock,
} from "../utils/codeParsing";
import TabbedCodeBlock, {
  CodeBlock,
} from "../../../components/TabbedCodeBlock";

interface CodeDisplayProps {
  snippets: CodeSnippet[];
}

export const CodeDisplay = ({ snippets }: CodeDisplayProps) => {
  if (snippets.length === 0) return <div>Loading...</div>;

  return (
    <div className="rounded-lg bg-slate-900 px-1 py-1">
      {snippets.length == 1 ? (
        <CodeBlock snippet={snippets[0]} />
      ) : (
        <TabbedCodeBlock snippets={snippets} />
      )}
    </div>
  );
};

export const MarkdownCodeComponent = ({
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
