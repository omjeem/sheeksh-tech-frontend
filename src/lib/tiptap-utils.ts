import { generateText, generateHTML, JSONContent } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { VariableExtension } from "@/components/notifications/templates/editor/Extensions";

export const getCleanPayload = (json: JSONContent) => {
  const ExportVariable = VariableExtension.extend({
    renderHTML({ HTMLAttributes }) {
      return `{{${HTMLAttributes.label}}}`;
    },
    renderText({ node }) {
      return `{{${node.attrs.label}}}`;
    },
  });

  const extensions = [StarterKit, ExportVariable];

  return {
    html: generateHTML(json, extensions),
    text: generateText(json, extensions),
  };
};

export const extractVariablesFromContent = (content: JSONContent): string[] => {
  const variables = new Set<string>();

  const traverse = (node: JSONContent) => {
    if (node.type === "variable" && node.attrs?.label) {
      variables.add(node.attrs.label);
    }

    if (node.content) {
      node.content.forEach((child) => traverse(child));
    }
  };

  traverse(content);
  return Array.from(variables);
};
