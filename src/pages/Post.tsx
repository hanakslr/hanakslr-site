import { useMemo } from "react";
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

  if (post.notFound) return <p>Post not found</p>;

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      <Link
        to="/"
        className="border-bottom flex flex-row items-center gap-1 hover:text-yellow-400"
      >
        <IconChevronLeft size={16} /> <div>Home</div>
      </Link>

      <div className="flex w-full flex-col items-center gap-4 rounded-xl p-2 py-4 md:gap-8 md:p-6 md:py-8">
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
          <article className="prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkFrontmatter]}
              rehypePlugins={[rehypeRaw]}
              components={{
                code: CodeMarkdownComponent,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
