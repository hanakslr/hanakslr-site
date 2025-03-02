import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      {/* The outlet is where all the components are actually being rendered */}
      <Outlet />
    </>
  );
}
