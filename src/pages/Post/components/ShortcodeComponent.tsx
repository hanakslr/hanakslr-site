import { WasmPage } from "../../Wasm";
import { HelloWorldWasm } from "../../Wasm/HelloWorldWasm";
import { SpirographDisplay } from "../../Wasm/SpirographDisplay";

const componentsMap: Record<string, React.FC<any>> = {
  CustomComponent: ({ ...props }) => <div {...props}>Yay Custom</div>,
  Spirograph: WasmPage,
  SpirographGallery: SpirographDisplay,
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
    const { node, ...compProps } = props;
    return <Component {...compProps} />;
  }
  return <div className={className} {...props} />;
};
