import React, { useEffect, useRef, useState } from "react";
import {
  Tab as HuTab,
  TabProps,
  TabGroup,
  TabList,
  TabPanel as HuTabPanel,
  TabPanels,
  TabPanelProps,
} from "@headlessui/react";
import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { tokyoNightStorm } from "@uiw/codemirror-theme-tokyo-night-storm";
import { rust } from "@codemirror/lang-rust";
import { IconFolder, IconFile } from "@tabler/icons-react";
import clsx from "clsx";

export interface CodeSnippet {
  name: string;
  language: string;
  code: string;
}

interface TabbedCodeBlockProps {
  snippets: CodeSnippet[];
}

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: FileNode[];
}

const buildFileTree = (snippets: CodeSnippet[]): FileNode[] => {
  const root: FileNode = {
    name: "",
    path: "",
    isDirectory: true,
    children: [],
  };

  snippets.forEach((snippet) => {
    const parts = snippet.name.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;

      if (!current.children) {
        current.children = [];
      }

      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = {
          name: part,
          path: parts.slice(0, i + 1).join("/"),
          isDirectory: !isLast,
          children: !isLast ? [] : undefined,
        };
        current.children.push(child);
      }

      current = child;
    }
  });

  return root.children || [];
};

const FileTree = ({
  nodes,
  onSelect,
  selectedFile,
}: {
  nodes: FileNode[];
  onSelect: (path: string) => void;
  selectedFile: string;
}) => {
  return (
    <div className="text-xs">
      {nodes.map((node) => (
        <div key={node.path} className="">
          {node.isDirectory ? (
            <div className="py-1">
              <div className="mb-1 flex items-center text-gray-400">
                <IconFolder size={16} className="mr-1" />
                <span>{node.name}</span>
              </div>
              <div className="ml-3">
                {node.children && (
                  <FileTree
                    nodes={node.children}
                    onSelect={onSelect}
                    selectedFile={selectedFile}
                  />
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={() => onSelect(node.path)}
              className={`w-full rounded py-1 text-left hover:bg-white/5 ${
                selectedFile === node.path ? "bg-white/10" : ""
              }`}
            >
              <div className="flex items-center">
                <IconFile size={16} className="mr-1 text-gray-400" />
                <span className="text-white">{node.name}</span>
              </div>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

const Tab = (props: TabProps) => {
  const { children, ...p } = props;
  return (
    <HuTab
      {...p}
      className="rounded-full px-3 py-1 text-xs/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
    >
      {children}
    </HuTab>
  );
};

const TabPanel = (props: TabPanelProps) => {
  const { children, ...p } = props;
  return (
    <HuTabPanel className="rounded-xl bg-slate-900" {...p}>
      {children}
    </HuTabPanel>
  );
};

export const CodeBlock = ({ snippet }: { snippet: CodeSnippet }) => {
  const editorRef = useRef<EditorView | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !editorRef.current) {
      const state = EditorState.create({
        doc: snippet.code,
        extensions: [
          basicSetup,
          rust(),
          EditorView.editable.of(false),
          EditorView.lineWrapping,
          EditorView.theme({
            "&": {
              padding: "8px",
              backgroundColor: "#0f172a",
              fontSize: "12px",
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            },
            ".cm-gutters": {
              display: "none",
            },
            ".cm-activeLine": {
              backgroundColor: "transparent",
            },
          }),
          tokyoNightStorm,
        ],
      });

      editorRef.current = new EditorView({
        state,
        parent: containerRef.current,
      });

      return () => {
        editorRef.current?.destroy();
        editorRef.current = null;
      };
    }
  }, [snippet.code]);

  return (
    <div
      ref={containerRef}
      className="max-h-[80vh] overflow-y-auto [&::-webkit-scrollbar-thumb:hover]:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-track]:bg-slate-900 [&::-webkit-scrollbar]:w-2"
    />
  );
};

const TabbedCodeBlock: React.FC<TabbedCodeBlockProps> = ({ snippets }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const fileTree = buildFileTree(snippets);
  const showFileTree = snippets.some((s) => s.name.includes("/"));

  const handleFileSelect = (path: string) => {
    const index = snippets.findIndex((s) => s.name === path);
    if (index !== -1) {
      setSelectedIndex(index);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {showFileTree && (
        <div className="border-b border-gray-700 px-4 py-2 pr-6 lg:border-b-0 lg:border-r lg:p-4">
          <FileTree
            nodes={fileTree}
            onSelect={handleFileSelect}
            selectedFile={snippets[selectedIndex]?.name || ""}
          />
        </div>
      )}
      <div className="flex-1">
        <TabGroup selectedIndex={selectedIndex} onChange={setSelectedIndex}>
          <TabList
            className={clsx(
              "gap-4 px-2 py-3",
              showFileTree ? "hidden lg:flex" : "flex",
            )}
          >
            {snippets.map((s) => (
              <Tab key={s.name}>{s.name}</Tab>
            ))}
          </TabList>
          <TabPanels className="">
            {snippets.map((s) => (
              <TabPanel key={s.name}>
                <CodeBlock snippet={s} />
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
};

export default TabbedCodeBlock;
