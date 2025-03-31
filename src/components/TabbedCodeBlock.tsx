import React from "react";
import {
  Tab as HuTab,
  TabProps,
  TabGroup,
  TabList,
  TabPanel as HuTabPanel,
  TabPanels,
  TabPanelProps,
} from "@headlessui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/cjs/styles/prism";

export interface CodeSnippet {
  name: string;
  language: string;
  code: string;
}

interface TabbedCodeBlockProps {
  snippets: CodeSnippet[];
}

const Tab = (props: TabProps) => {
  const { children, ...p } = props;
  return (
    <HuTab
      {...p}
      className="rounded-full px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
    >
      {children}
    </HuTab>
  );
};

const TabPanel = (props: TabPanelProps) => {
  const { children, ...p } = props;
  return (
    <HuTabPanel className="rounded-xl bg-white/5" {...p}>
      {children}
    </HuTabPanel>
  );
};

const TabbedCodeBlock: React.FC<TabbedCodeBlockProps> = ({
  snippets,
  ...props
}) => {
  return (
    <TabGroup>
      <TabList className="flex gap-4 bg-slate-600">
        {snippets.map((s) => (
          <Tab key={s.name}>{s.name}</Tab>
        ))}
      </TabList>
      <TabPanels className="">
        {snippets.map((s) => (
          <TabPanel key={s.name}>
            <SyntaxHighlighter
              language={s.language}
              PreTag="div"
              style={dracula}
              {...props}
            >
              {String(s.code).replace(/\n$/, "")}
            </SyntaxHighlighter>
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
};

export default TabbedCodeBlock;
