import { IconChevronLeft } from "@tabler/icons-react";
import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Post() {
  const { slug } = useParams({ from: "/posts/$slug" });
  const post = useLoaderData({ from: "/posts/$slug" });

  if (post.notFound) return <p>Post not found</p>;

  return (
    <div className="flex flex-col gap-4 p-2 sm:p-4">
      <Link
        to="/"
        className="border-bottom flex flex-row items-center gap-1 hover:text-yellow-400"
      >
        <IconChevronLeft size={16} /> <div>Return Home</div>
      </Link>

      <div className="flex w-full flex-col items-center gap-4 rounded-xl border-yellow-400 p-2 py-4 sm:border-2 md:gap-8 md:p-6 md:py-8">
        <div className="flex w-2/3 border">
          <article className="prose">
            <h1>{slug.replace(/-/g, " ")}</h1>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
