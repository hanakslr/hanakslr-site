import { useMemo } from "react";
import { useLoaderData } from "@tanstack/react-router";
import frontMatter from "front-matter";
import { BreadcrumbsHeader } from "../../components/BreadcrumbsHeader";
import { Blog } from "./Blog";

interface PostAttributes {
  title: string;
  subtitle?: string;
  publishedOn?: string;
  coverImage?: {
    src: string;
    alt: string;
    source?: string;
  };
}

export default function Post() {
  const post = useLoaderData({ from: "/posts/$slug" });

  const parsed = useMemo(() => {
    if (!post?.content) return null;
    return frontMatter<PostAttributes>(post.content);
  }, [post]);

  const attributes = parsed?.attributes;

  if (post.notFound || !post.content) return <p>Post not found</p>;

  const title = attributes?.title || "Untitled Post";

  return (
    <>
      <BreadcrumbsHeader
        items={[{ label: "Home", href: "/" }, { label: title }]}
      />
      <Blog
        title={title}
        subtitle={attributes?.subtitle}
        publishedOn={attributes?.publishedOn}
        content={post.content}
        coverImage={attributes?.coverImage}
      />
    </>
  );
}
