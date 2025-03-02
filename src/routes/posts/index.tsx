import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts/")({
  component: Post,
});

function Post() {
  return <div>Go home to select a post :)</div>;
}
