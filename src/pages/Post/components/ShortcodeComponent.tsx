import { WasmPage } from "../../Wasm";
import { HelloWorldWasm } from "../../Wasm/HelloWorldWasm";

const componentsMap: Record<string, React.FC<any>> = {
  CustomComponent: ({ ...props }) => <div {...props}>Yay Custom</div>,
  Spirograph: WasmPage,
  HelloWasm: HelloWorldWasm,
};

// Define the shortcode component separately
export const MarkdownShortcodeComponent = ({
  className,
  name,
  ...props
}: any) => {
  if (className === "shortcode" && name) {
    const Component = componentsMap[name];
    if (!Component) return <div>Unknown shortcode: {name}</div>;
    return <Component {...props} />;
  }
  return <div className={className} {...props} />;
};
