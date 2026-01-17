import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { Badge } from "@/components/ui/badge";

const VariableComponent = ({ node }: { node: any }) => {
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
      id: { default: null },
      label: { default: null },
    };
  },
  parseHTML() {
    return [
      {
        tag: "variable-component",
        getAttrs: (node) => ({
          label: (node as HTMLElement).getAttribute("label"),
        }),
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

  // This defines how it looks when calling editor.getText()
  renderText({ node }) {
    return `{{${node.attrs.label}}}`;
  },
});
