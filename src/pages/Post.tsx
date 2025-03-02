import { Link, useLoaderData, useParams } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Post() {
  const { slug } = useParams({ from: "/posts/$slug" });
  const post = useLoaderData({ from: "/posts/$slug" });

  if (post.notFound) return <p>Post not found</p>;

  return (
    <div>
      <Link to="/" className="underline">
        Return Home
      </Link>
      <article className="prose">
        <h1>{slug.replace(/-/g, " ")}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </article>
    </div>
  );
}
