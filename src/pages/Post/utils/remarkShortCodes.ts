import { visit } from "unist-util-visit";

/**
 * Any paragraphs in the markdown that match [[MyInterestingComponent]], get a special
 * `shortcode` className tag so that we can use the custom shortcode markdown component
 * to render whatever the shortcode corresponds to. The mapping is in `ShortcodeComponent.tsx`.
 */
export function remarkShortcodes() {
  return (tree: any) => {
    visit(tree, "paragraph", (node, index, parent) => {
      if (!node.children || node.children.length !== 1) return;
      const child = node.children[0];
      if (child.type !== "text") return;

      const match = child.value.match(/^\s*\[\[([A-Za-z0-9_]+)(.*?)\]\]\s*$/);
      if (!match) return;

      const [, name, rawProps] = match;

      const newNode = {
        type: "div",
        data: {
          hName: "div",
          hProperties: {
            className: "shortcode",
            name: name,
            ...parseProps(rawProps),
          },
        },
      };

      if (index) {
        parent.children[index] = newNode;
      }
    });
  };
}

/** We can pass props to the custom compoents like [[MyInterestingComponent key=value]] */
function parseProps(raw: string) {
  const props: Record<string, any> = {};
  const regex = /([a-zA-Z0-9_]+)=("(.*?)"|[^\s"]+)/g;

  let match;
  while ((match = regex.exec(raw)) !== null) {
    const key = match[1];
    const value = match[3] !== undefined ? match[3] : match[2];
    props[key] = value;
  }

  return props;
}
