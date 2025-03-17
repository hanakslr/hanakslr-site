import { useEffect } from "react";
import init, { Spirograph } from "./pkg/spirograph_wasm";

export const WasmPage = () => {
  useEffect(() => {
    init().then(() => {
      const spiro = new Spirograph("spiro-canvas");
      spiro.draw();
    });
  }, []);
  return (
    <div>
      <canvas
        id="spiro-canvas"
        width="500"
        height="500"
        style={{ border: "1px solid black" }}
      ></canvas>
    </div>
  );
};
