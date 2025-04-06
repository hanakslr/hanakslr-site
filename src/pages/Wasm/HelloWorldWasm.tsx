import { useEffect, useState } from "react";
import init, { greet } from "./hello_pkg/hello_wasm";

/** Dummy "Hello World" Wasm example */
export const HelloWorldWasm = () => {
  const [greeting, setGreeting] = useState<string>();
  useEffect(() => {
    init().then(() => {
      setGreeting(greet());
    });
  });

  return (
    <p className="rounded-lg bg-sky-50 p-4">
      The WASM compiled Rust says:{" "}
      <span className="animate-pulse font-medium text-sky-600">{greeting}</span>
    </p>
  );
};
