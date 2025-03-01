import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../pages/Home";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <HomePage />;
}
