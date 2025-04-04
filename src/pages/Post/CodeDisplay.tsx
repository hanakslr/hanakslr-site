import { CodeSnippet } from "./CodeBlock";
import TabbedCodeBlock, { CodeBlock } from "../../components/TabbedCodeBlock";

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
