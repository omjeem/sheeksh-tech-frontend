import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Node, NodeViewProps } from "@tiptap/core";
import { Badge } from "@/components/ui/badge";

const inputRegex = /{{([^}]+)}}/g;

const VariableComponent = ({ node }: NodeViewProps) => {
  return (
    <NodeViewWrapper className="inline-block align-middle mx-1">
      <Badge
        variant="secondary"
        className="px-2 py-0 h-6 text-xs font-mono text-primary bg-primary/10 border-primary/20 rounded select-none whitespace-nowrap"
      >
        {node.attrs.label}
      </Badge>
    </NodeViewWrapper>
  );
};

export const VariableExtension = Node.create({
  name: "variable",
  group: "inline",
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: {
        default: null,
        parseHTML: (element) =>
          element.getAttribute("data-variable") ||
          element.innerText.replace(/[{}]/g, ""),
      },
    };
  },

  parseHTML() {
    return [
      { tag: "span[data-variable]" },
      {
        tag: "span",
        getAttrs: (node) => {
          const text = (node as HTMLElement).innerText;
          return inputRegex.test(text)
            ? { label: text.replace(/[{}]/g, "") }
            : false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      { "data-variable": HTMLAttributes.label },
      `{{${HTMLAttributes.label}}}`,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VariableComponent);
  },
});
