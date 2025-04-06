import { createFileRoute } from "@tanstack/react-router";
import Post from "../../pages/Post";

interface PostData {
  content?: string;
  notFound?: boolean;
}

export const Route = createFileRoute("/posts/$slug")({
  // Or in a component
  component: Post,
  loader: async ({ params }): Promise<PostData> => {
    try {
      const post = await import(`../../assets/posts/${params.slug}.md?raw`);
      return { content: post.default };
    } catch (error) {
      return { notFound: true };
    }
  },
});
