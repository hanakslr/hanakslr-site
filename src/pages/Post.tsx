import { useMemo, useState, useEffect } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link, useLoaderData } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import frontMatter from "front-matter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import TabbedCodeBlock, {
  CodeSnippet,
  CodeBlock,
} from "../components/TabbedCodeBlock";
import React from "react";

// Utility type for header items
interface TOCItem {
  id: string;
  text: string;
  level: number;
}

// Function to create a slug from heading text
const slugify = (text: React.ReactNode): string => {
  // Convert React node to string
  const stringText = React.Children.toArray(text)
    .map((node) => {
      if (typeof node === "string") return node;
      if (typeof node === "number") return String(node);
      return "";
    })
    .join("");

  return stringText
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/--+/g, "-"); // Replace multiple hyphens with single hyphen
};

// Function to extract headings from markdown content
const extractHeadings = (markdown: string): TOCItem[] => {
  const headingLines = markdown
    .split("\n")
    .filter((line) => line.startsWith("#") && !line.startsWith("#@"));
  return headingLines.map((line) => {
    // Count the number of # at the beginning to determine level
    const level = line.match(/^#+/)?.[0].length || 0;
    const text = line.replace(/^#+\s+/, "");
    // Create an ID based on the text content
    const id = slugify(text);
    return { id, text, level };
  });
};

// Table of Contents component
const TableOfContents = ({ items }: { items: TOCItem[] }) => {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -35% 0%" },
    );

    // Observe all section headings
    items.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => {
      items.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-0 hidden max-h-screen w-64 overflow-auto p-4 lg:block">
      <h2 className="mb-2 text-sm font-semibold uppercase text-gray-500">
        On this page
      </h2>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className={`border-l-2 py-1 pl-3 text-sm transition-colors ${
              activeId === item.id
                ? "border-yellow-400 text-yellow-400"
                : "border-gray-200 text-gray-600 hover:text-yellow-400"
            } ${item.level === 2 ? "" : "ml-" + (item.level - 2)} `}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

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

const CodeMarkdownComponent = ({
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
          name: properties.title || i,
        };
      });

    if (snippets.length == 1) return <CodeBlock snippet={snippets[0]} />;
    return <TabbedCodeBlock snippets={snippets} />;
  }
  return (
    <code className={className} {...props}>
      {children}
    </code>
  );
};

export default function Post() {
  const post = useLoaderData({ from: "/posts/$slug" });

  const parsed = useMemo(() => {
    if (!post?.content) return null;
    return frontMatter(post.content);
  }, [post]);

  const attributes = parsed?.attributes as any;

  // Extract headings for table of contents
  const headings = useMemo(() => {
    if (!post?.content) return [];
    return extractHeadings(post.content);
  }, [post?.content]);

  if (post.notFound) return <p>Post not found</p>;

  // Custom components that just add IDs to headings for TOC navigation
  const customComponents = {
    code: CodeMarkdownComponent,
    h1: ({ children, ...props }: any) => (
      <h1 id={slugify(children)} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 id={slugify(children)} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 id={slugify(children)} {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }: any) => (
      <h4 id={slugify(children)} {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }: any) => (
      <h5 id={slugify(children)} {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }: any) => (
      <h6 id={slugify(children)} {...props}>
        {children}
      </h6>
    ),
  };

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      <Link
        to="/"
        className="border-bottom flex flex-row items-center gap-1 hover:text-yellow-400"
      >
        <IconChevronLeft size={16} /> <div>Home</div>
      </Link>

      <div className="flex w-full flex-row items-start gap-4">
        <TableOfContents items={headings} />

        <div className="flex flex-1 flex-col items-center gap-4 rounded-xl p-2 py-4 md:gap-8 md:p-6 md:py-8">
          <div className="flex w-full max-w-3xl flex-col">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">{attributes.title}</h1>
              {attributes.subtitle && (
                <p className="text-xl text-gray-600">{attributes.subtitle}</p>
              )}
              <p className="text-sm text-gray-500">
                {new Date(attributes.publishedOn).toLocaleDateString()}
              </p>
            </header>
            <article className="prose lg:prose-lg">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkFrontmatter]}
                rehypePlugins={[rehypeRaw]}
                components={customComponents}
              >
                {post.content}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
