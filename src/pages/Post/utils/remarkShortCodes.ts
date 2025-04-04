import { visit } from "unist-util-visit";

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
