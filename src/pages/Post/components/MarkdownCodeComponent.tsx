import { useState, useEffect, useMemo } from "react";
import { parseCodeBlock, parseGitCodeBlock } from "../utils/codeParsing";
import TabbedCodeBlock, {
  CodeBlock,
} from "../../../components/TabbedCodeBlock";

export interface CodeSnippet {
  name: string; // an id type field
  language: string;
  code: string; // content
  title?: string; // optional title property
  entry?: boolean; // if there are multiple files, which on should be visible on render
  foldRanges?: [number, number][]; // any ranges of code that should start collapsed
}

interface CodeDisplayProps {
  snippets: CodeSnippet[];
}

/** Given snippets, renders a single or tabbed code block. */
const CodeDisplay = ({ snippets }: CodeDisplayProps) => {
  if (snippets.length === 0) return <div>Loading...</div>;

  return (
    <div className="rounded-lg bg-slate-900 px-1 py-1">
      {snippets.length == 1 ? (
        <CodeBlock snippet={snippets[0]} showLineNumbers={false} />
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
