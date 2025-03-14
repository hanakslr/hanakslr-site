import { useEffect, useState } from "react";

const loadWasm = async (name: string) => {
  // Fetch and instantiate the WASM module
  const wasm = await import(`./${name}/strava_stats.js`);
  await wasm.default();

  return wasm;
};

export const WasmPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const greetWasm = async () => {
      const wasm = await loadWasm("pkg_1");
      setMessage(wasm.greet());
    };

    greetWasm();
  });
  return <div>{message}</div>;
};
