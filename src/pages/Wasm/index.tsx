import { useEffect, useMemo, useState } from "react";
import * as wasm2 from "./pkg/spirograph_wasm";

const loadWasm = async (name: string) => {
  // Fetch and instantiate the WASM module
  const wasm = await import(`./${name}/spirograph_wasm.js`);
  await wasm.default();

  return wasm;
};

export const WasmPage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const greetWasm = async () => {
      const wasm = await loadWasm("pkg");
      setMessage(wasm.greet());
    };

    greetWasm();
  });

  const anotherMessage = useMemo(async () => {
    return await wasm2.greet();
  }, [wasm2]);

  return (
    <div>
      <div> Message from import method 1: {message}</div>
      <div>Message from import method 2: {anotherMessage}</div>
    </div>
  );
};
