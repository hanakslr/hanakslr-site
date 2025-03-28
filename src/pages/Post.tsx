import { useMemo } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { Link, useLoaderData } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import frontMatter from "front-matter";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";

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
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkFrontmatter]}>
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
