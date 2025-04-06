import { createFileRoute } from "@tanstack/react-router";
import { WasmPage } from "../pages/Wasm";

export const Route = createFileRoute("/rust_wasm")({
  component: RouteComponent,
});

function RouteComponent() {
  return <WasmPage />;
}
