import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import { extractHeadings, headingsComponents } from "./utils";
import { CodeMarkdownComponent } from "./CodeBlock";

interface BlogProps {
  title: string;
  subtitle?: string;
  publishedOn?: string;
  content: string;
  customComponents?: Record<string, any>;
  coverImage?: {
    src: string;
    alt: string;
    source?: string;
  };
}

export function Blog({
  title,
  subtitle,
  publishedOn,
  content,
  customComponents = {},
  coverImage,
}: BlogProps) {
  const headings = extractHeadings(content);

  const defaultComponents = {
    pre: ({ children }: React.ComponentPropsWithoutRef<"pre">) => children,
    ...headingsComponents,
    code: CodeMarkdownComponent,
    ...customComponents,
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-row gap-8">
        {/* Navigation Section (TOC) */}
        <nav className="w-2xs sticky top-24 hidden h-screen pr-6 md:flex">
          <div className="mt-24">
            <h4 className="font-heading mb-4 text-xl tracking-tight">
              On this page
            </h4>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  className="block text-gray-700 transition duration-300 hover:text-blue-500"
                >
                  {heading.text}
                </a>
              ))}
            </nav>
          </div>
        </nav>

        {/* Main Content */}
        <div className="w-full rounded-2xl md:w-4/5 lg:w-2/3">
          {coverImage && (
            <div className="relative h-[400px] overflow-hidden rounded-t-2xl">
              <img
                src={coverImage.src}
                alt={coverImage.alt}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent via-20% to-white" />
              {coverImage.source && (
                <a
                  href={`//commons.wikimedia.org/wiki/User:${coverImage.source}`}
                  className="absolute right-4 top-4 text-sm text-gray-500 hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source: {coverImage.source}
                </a>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {publishedOn && (
                  <p className="text-sm tracking-widest">
                    {new Date(publishedOn).toLocaleDateString()}
                  </p>
                )}
                <h1 className="font-heading mb-3 mt-1 text-4xl tracking-tighter md:text-5xl lg:text-6xl">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xl tracking-tighter text-slate-700">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}
          <article className="prose max-w-none md:p-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkFrontmatter]}
              rehypePlugins={[rehypeRaw]}
              components={defaultComponents}
            >
              {content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
