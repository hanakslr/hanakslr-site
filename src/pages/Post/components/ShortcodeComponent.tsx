import { WasmPage } from "../../Wasm";
import { HelloWorldWasm } from "../../Wasm/HelloWorldWasm";
import { SpirographDisplay } from "../../Wasm/SpirographDisplay";

const componentsMap: Record<string, React.FC<any>> = {
  CustomComponent: ({ ...props }) => <div {...props}>Yay Custom</div>,
  Spirograph: WasmPage,
  SpirographGallery: SpirographDisplay,
  HelloWasm: HelloWorldWasm,
};

/**
 * This is the entrypoint for embedding other components inside of the markdown
 * generated page. The remarkShortCode plugin that is in utils adds the shortcode
 * className to divs that meet the syntax [[ShortCodeComponent]]. And the mapping
 * above maps that name to what should be displayed.
 */

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
