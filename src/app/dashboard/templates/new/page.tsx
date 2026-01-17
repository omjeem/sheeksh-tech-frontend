"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

// Local imports
import { VariableExtension } from "@/components/notifications/templates/editor/Extensions";
import EditorToolbar from "@/components/notifications/templates/editor/EditorToolbar";
import CategoriesBar from "@/components/notifications/templates/CategoriesBar";
import VariablesBar from "@/components/notifications/templates/VariablesBar";
import { Category } from "@/types/notification";
import {
  extractVariablesFromContent,
  getCleanPayload,
} from "@/lib/tiptap-utils";
import { notificationService } from "@/services/notificationService";

// UI Imports
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Code, Eye, Send, ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NotificationTemplateBuilder() {
  const router = useRouter();

  // Form State
  const [templateName, setTemplateName] = useState("");
  const [subject, setSubject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Write your message content here...",
      }),
      VariableExtension,
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none h-full p-6 break-words break-all whitespace-pre-wrap",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.getData("variable")) {
          const data = JSON.parse(event.dataTransfer.getData("variable"));
          const { schema } = view.state;
          const coordinates = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          });
          if (coordinates) {
            const node = schema.nodes.variable.create({ label: data });
            const transaction = view.state.tr.insert(coordinates.pos, node);
            view.dispatch(transaction);
          }
          return true;
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  const insertVariable = (variable: string) => {
    editor
      ?.chain()
      .focus()
      .insertContent({ type: "variable", attrs: { label: variable } })
      .run();
  };

  const handleDragStart = (e: React.DragEvent, variable: string) => {
    e.dataTransfer.setData("variable", JSON.stringify(variable));
  };

  const handleSubmit = async () => {
    if (!editor || !selectedCategory || !templateName || !subject) {
      toast.warning(
        "Please fill in all required fields (Name, Category, and Subject).",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const jsonContent = editor.getJSON();
      const { html, text } = getCleanPayload(jsonContent);
      const usedVariables = extractVariablesFromContent(jsonContent);

      const payload = {
        name: templateName,
        categoryId: selectedCategory.id,
        payload: {
          subject: subject,
          bodyHtml: html,
          bodyText: text,
          variables: usedVariables,
        },
      };

      await notificationService.templates.create(payload);

      toast.success("Template created successfully!");
      router.push("/dashboard/templates");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(
        error?.message || "Failed to save template. Please try again.",
      );
      toast.error("Error saving template");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard/templates")}
            className="rounded-full"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create Template
            </h1>
            <p className="text-sm text-muted-foreground">
              Define a new notification preset.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? (
              <>
                <Code className="mr-2 h-4 w-4" /> Editor
              </>
            ) : (
              <>
                <Eye className="mr-2 h-4 w-4" /> Preview
              </>
            )}
          </Button>
          <Button
            onClick={handleSubmit}
            // disabled={isSubmitting || !templateName || !subject}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Save Template
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 min-h-0">
        {/* 2. Configuration Card */}
        <Card className="shadow-sm shrink-0">
          <CardContent className="px-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="templateName">Internal Template Name</Label>
                <Input
                  id="templateName"
                  placeholder="e.g., Weekly Grade Report"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground uppercase">
                  Used for searching templates internally
                </p>
              </div>
              <div className="space-y-2">
                <CategoriesBar
                  selectedId={selectedCategory?.id || null}
                  onSelect={setSelectedCategory}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="subject">Notification Subject</Label>
              <Input
                id="subject"
                placeholder="The subject line the recipient will see"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="text-lg font-medium border-primary/20 focus-visible:ring-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Editor / Preview Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {isPreview ? (
            <div className="flex-1 bg-muted/30 rounded-xl border-2 border-dashed p-4 md:p-12 overflow-y-auto">
              <div className="max-w-2xl mx-auto bg-background rounded-lg shadow-xl border overflow-hidden">
                <div className="bg-primary/5 p-6 border-b">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">
                      {selectedCategory?.category || "General"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">
                    {subject || "Untitled Subject"}
                  </h2>
                </div>
                <div
                  className="p-8 prose prose-blue dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: editor?.getHTML() || "" }}
                />
              </div>
            </div>
          ) : (
            <Card className="flex-1 flex flex-col gap-0 overflow-hidden border-2 shadow-inner">
              <EditorToolbar editor={editor} />
              <div className="flex-1 flex flex-row overflow-hidden">
                <div className="flex-1 overflow-y-auto scrollbar-thin">
                  <EditorContent className="h-full" editor={editor} />
                </div>
                <div className="w-72 border-l bg-muted/10 hidden lg:block overflow-y-auto">
                  <div className="p-4 sticky top-0">
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                      Available Variables
                    </h3>
                    <VariablesBar
                      onDragStart={handleDragStart}
                      onInsertVariable={insertVariable}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
