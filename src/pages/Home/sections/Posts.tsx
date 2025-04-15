import WindowHeightSection from "../../../components/WindowHeightSection";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import fm from "front-matter";

interface Post {
  slug: string;
  title: string;
  publishedOn?: string;
  subtitle?: string;
  date?: Date;
}

const getAllPosts = async (): Promise<Post[]> => {
  const files = import.meta.glob("/src/assets/posts/*.md", {
    eager: true,
    as: "raw",
  });

  const posts = Object.entries(files).map(([filePath, content]) => {
    const slug = filePath.split("/").pop()?.replace(".md", "");
    const markdownContent = content;

    const { attributes } = fm<{
      title?: string;
      publishedOn?: string;
      subtitle?: string;
    }>(markdownContent); // Extract front matter

    const publishedOn = attributes.publishedOn
      ? new Date(attributes.publishedOn)
      : undefined;

    return {
      slug: slug || "",
      title: attributes.title || slug || "",
      publishedOn: publishedOn ? publishedOn.toLocaleDateString() : undefined,
      subtitle: attributes.subtitle,
      date: publishedOn,
    };
  });

  // Sort posts by date in descending order (newest first)
  return posts.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.getTime() - a.date.getTime();
  });
};

export const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const populate = async () => {
      const p = await getAllPosts();
      setPosts(p);
    };

    populate();
  }, []);

  return (
    <WindowHeightSection>
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border-2 border-yellow-400">
        <div className="flex flex-col items-center gap-2 pb-2 text-center">
          <h1 className="w-full text-center text-2xl font-bold">Notes</h1>
          <h3 className="font-mono text-xs text-slate-700">
            Sometimes I write things down
          </h3>
        </div>
        <div className="flex flex-col gap-4 p-4">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to="/posts/$slug"
              params={{ slug: post.slug }}
              className="rounded-xl p-4 text-lg hover:bg-yellow-400/10"
            >
              <div className="flex flex-col gap-1">
                <span className="pb-1 text-xs font-thin text-slate-500">
                  {post.publishedOn}
                </span>
                <span className="text-md">{post.title}</span>
                <span className="text-sm font-light">{post.subtitle}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </WindowHeightSection>
  );
};
