import { useEffect, useState } from "react";
import init, { generate_svg } from "./pkg/spirograph_wasm";

export const WasmPage = () => {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    init().then(() => {
      setSvg(generate_svg());
    });
  }, []);
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
};
