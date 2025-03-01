import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/post")({
  component: Post,
});

function Post() {
  return <div>This is a post</div>;
}
