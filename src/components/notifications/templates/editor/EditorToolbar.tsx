"use client";

import { Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const ToggleBtn = ({
  isActive,
  onClick,
  icon: Icon,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ElementType;
}) => (
  <Button
    variant={isActive ? "secondary" : "ghost"}
    size="icon"
    className="h-8 w-8"
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

export default function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <div className="border-b bg-muted/30 p-2 flex flex-wrap items-center gap-1 rounded-t-xl">
      <ToggleBtn
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        icon={Bold}
      />
      <ToggleBtn
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        icon={Italic}
      />
      <div className="w-px h-6 bg-border mx-2" />
      <ToggleBtn
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        icon={List}
      />
      <ToggleBtn
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        icon={ListOrdered}
      />
      <ToggleBtn
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        icon={Quote}
      />
      <div className="w-px h-6 bg-border mx-2" />
      <ToggleBtn
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        icon={Undo}
      />
      <ToggleBtn
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        icon={Redo}
      />
    </div>
  );
}
