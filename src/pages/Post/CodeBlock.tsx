import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
} from "@codesandbox/sandpack-react";
import { freeCodeCampDark } from "@codesandbox/sandpack-themes";
import { rust } from "@codemirror/lang-rust";

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

export const CodeMarkdownComponent = ({
  className,
  children,
  inline,
  ...props
}: any) => {
  const match = /language-(\w+)/.exec(className || "");

  if (!inline && match) {
    const languages = match[1].split("|"); // Use `|` to separate languages
    const snippets: CodeSnippet[] = children
      .trim()
      .split("\n\n---\n\n")
      .map((code: string, i: number) => {
        const { properties, remainingText } = parseProperties(code);

        return {
          language: languages[i] || "plaintext",
          code: remainingText,
          title: properties.title,
          name: properties.title || i,
        };
      });

    // Create files object for Sandpack
    const files = snippets.reduce<Record<string, string>>((acc, cur) => {
      acc[cur.name] = cur.code;
      return acc;
    }, {});

    // If all the files odn't have titles, don't show the tabs or tree
    const showFiles = !snippets.some((s) => !!!s.title);
    const showFileTree =
      showFiles &&
      snippets.length > 1 &&
      snippets.some((s) => s.name.includes("/"));

    return (
      <SandpackProvider
        theme={freeCodeCampDark}
        files={files}
        customSetup={{
          entry: snippets[0].name,
        }}
        options={{
          visibleFiles: Object.keys(files),
        }}
      >
        <SandpackLayout>
          {showFileTree && <SandpackFileExplorer autoHiddenFiles />}
          <SandpackCodeEditor
            additionalLanguages={[
              {
                name: "rust",
                extensions: ["rs"],
                language: rust(),
              },
            ]}
            showLineNumbers={false}
            wrapContent
            showTabs={showFiles}
            style={
              snippets.length === 1
                ? {
                    height: "auto",
                  }
                : {}
            }
          />
        </SandpackLayout>
      </SandpackProvider>
    );
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};
