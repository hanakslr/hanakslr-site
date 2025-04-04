import {
  SandpackProvider,
  SandpackLayout,
  SandpackFileExplorer,
  SandpackCodeEditor,
  SandpackCodeViewer,
} from "@codesandbox/sandpack-react";
import { freeCodeCampDark } from "@codesandbox/sandpack-themes";
import { rust } from "@codemirror/lang-rust";
import { CodeSnippet } from "./CodeBlock";
import { useState, useCallback, useEffect, useRef } from "react";
import { IconMaximize, IconMinimize } from "@tabler/icons-react";

interface CodeDisplayProps {
  snippets: CodeSnippet[];
  entry: string;
  fitHeight: boolean;
}

export const CodeDisplay = ({
  snippets,
  entry,
  fitHeight,
}: CodeDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  // Handle scroll blocking and click outside
  useEffect(() => {
    if (isExpanded) {
      // Block scrolling
      document.body.style.overflow = "hidden";

      // Handle click outside
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsExpanded(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isExpanded]);

  // Create files object for Sandpack
  const files = snippets.reduce<Record<string, string>>((acc, cur) => {
    acc[cur.name] = cur.code;
    return acc;
  }, {});

  // If all the files don't have titles, don't show the tabs or tree
  const showTabs = !snippets.some((s) => !!!s.title);
  const showFileTree =
    showTabs &&
    snippets.length > 1 &&
    snippets.some((s) => s.name.includes("/"));

  if (snippets.length === 0) return <div>Loading...</div>;
  return (
    <div
      className={`${isExpanded ? "fixed -top-6 bottom-6 left-0 right-0 z-50 h-screen bg-black/50 p-8" : ""}`}
    >
      <SandpackProvider
        theme={freeCodeCampDark}
        files={files}
        customSetup={{
          entry: entry,
        }}
        options={{
          visibleFiles: Object.keys(files),
        }}
      >
        <SandpackLayout ref={containerRef}>
          {showFileTree && (
            <SandpackFileExplorer autoHiddenFiles className="h-full" />
          )}

          {snippets.length > 1 ? (
            <SandpackCodeViewer
              wrapContent
              additionalLanguages={[
                {
                  name: "rust",
                  extensions: ["rs"],
                  language: rust(),
                },
              ]}
              showTabs={showTabs}
              // @ts-expect-error Property 'style' is actually supported by SandpackCodeViewer
              style={{
                height: isExpanded
                  ? "80vh"
                  : window.innerWidth < 768
                    ? "auto"
                    : showFileTree
                      ? "70vh"
                      : "",
                maxHeight: !isExpanded && window.innerWidth < 768 ? "70vh" : "",
              }}
            />
          ) : (
            /** Its hard to resize the code viewer to the height of the content. If there is only
             * one file, just use a read only editor.
             */
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
              readOnly
              showReadOnly={false}
              showTabs={showTabs}
              style={
                fitHeight
                  ? {
                      height: "auto",
                    }
                  : isExpanded
                    ? { height: "80vh" }
                    : {}
              }
            />
          )}

          {!fitHeight && (
            <button
              onClick={toggleExpand}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded bg-gray-700 text-white opacity-50 hover:opacity-100"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? (
                <IconMinimize size={16} />
              ) : (
                <IconMaximize size={16} />
              )}
            </button>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};
