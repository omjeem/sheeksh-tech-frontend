"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  notificationService,
  DraftPayload,
} from "@/services/notificationService";
import RecipientSelector from "@/components/notifications/draft/RecipientSelector";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Send,
  ArrowLeft,
  Info,
  Save,
  Mail,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { convertHtmlVariablesToUpperCase } from "@/lib/tiptap-utils";

export default function DraftNotificationPage() {
  const { templateId } = useParams();
  const router = useRouter();

  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Track the ID once the draft is created to prevent re-saving
  const [savedDraftId, setSavedDraftId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<"saving" | "sending" | null>(
    null,
  );

  const [draftData, setDraftData] = useState<DraftPayload>({
    channels: ["EMAIL"],
    users: { sentAll: true, isInclude: true, values: [] },
    teachers: { sentAll: true, isInclude: true, values: [] },
    students: { sentAll: true, isInclude: true, values: [] },
  });

  const toggleChannel = (channel: "EMAIL" | "SMS") => {
    setDraftData((prev) => {
      const isSelected = prev.channels.includes(channel);
      let newChannels: ("EMAIL" | "SMS")[] = [];

      if (isSelected) {
        // Prevent removing the last channel
        if (prev.channels.length === 1) {
          toast.error("At least one delivery channel must be selected.");
          return prev;
        }
        newChannels = prev.channels.filter((c) => c !== channel);
      } else {
        newChannels = [...prev.channels, channel];
      }

      return { ...prev, channels: newChannels };
    });

    if (savedDraftId) setSavedDraftId(null);
  };

  /**
   * Internal helper to handle the creation/saving of the draft
   */
  const performSave = async () => {
    const data = await notificationService.drafts.create(
      templateId as string,
      draftData,
    );
    setSavedDraftId(data?.[0]?.id);
    return data?.[0]?.id;
  };

  // ACTION 1: Just Save
  const handleSaveOnly = async () => {
    setIsProcessing("saving");
    try {
      await performSave();
      toast.success("Draft saved successfully. You can send it later.");
      router.push("/dashboard/notifications");
    } catch (error: any) {
      toast.error(error.message || "Failed to save draft");
    } finally {
      setIsProcessing(null);
    }
  };

  // ACTION 2: Save (if needed) and Send
  const handleDraftAndSend = async () => {
    setIsProcessing("sending");
    try {
      let currentId = savedDraftId;

      // Only save if we haven't already generated a draft ID
      if (!currentId) {
        currentId = await performSave();
      }

      try {
        await notificationService.drafts.send(currentId as string);
        toast.success("Notification sent started!");
      } catch (sendError: any) {
        console.error("Dispatch Error:", sendError);
        // We notify the user it failed, but we continue to the navigation step below
        toast.error(
          "Draft saved, but the send command failed. Check status in the list.",
        );
      }

      router.push("/dashboard/notifications");
    } catch (error: any) {
      toast.error(error.message || "Failed to process request");
    } finally {
      setIsProcessing(null);
    }
  };

  useEffect(() => {
    if (templateId && typeof templateId === "string") {
      notificationService.templates.get(templateId).then((all) => {
        setTemplate(all.find((t: any) => t.id === templateId));
        setLoading(false);
      });
    }
  }, [templateId]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  return (
    <div className="flex-1 overflow-auto flex flex-col space-y-8">
      <header className="flex items-center flex-wrap gap-3 justify-between">
        <div className="flex items-center flex-wrap gap-8">
          <div className="flex-1 flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Dispatch Notification
              </h1>
              <p className="text-sm text-muted-foreground">
                Configure audience for{" "}
                <span className="text-primary font-medium">
                  {template.name}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { id: "EMAIL", label: "Email", icon: Mail },
              { id: "SMS", label: "SMS", icon: MessageSquare },
            ].map((ch) => {
              const active = draftData.channels.includes(ch.id as any);
              return (
                <button
                  key={ch.id}
                  onClick={() => toggleChannel(ch.id as any)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-left min-w-[200px]",
                    active
                      ? "border-primary bg-primary/5 text-primary shadow-sm"
                      : "border-muted bg-transparent text-muted-foreground hover:border-muted-foreground/30",
                  )}
                >
                  <ch.icon
                    className={cn(
                      "h-5 w-5",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{ch.label}</p>
                    <p className="text-[10px] opacity-70">
                      {active ? "Enabled" : "Disabled"}
                    </p>
                  </div>
                  {active && <CheckCircle2 className="h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* OPTION 1: Save Draft */}
          <Button
            variant="outline"
            onClick={handleSaveOnly}
            disabled={!!isProcessing || !!savedDraftId} // Disabled if sending OR if already saved
            className="border-primary text-primary hover:bg-primary/5"
          >
            {isProcessing === "saving" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {savedDraftId ? "Draft Saved" : "Save Draft"}
          </Button>

          {/* OPTION 2: Draft and Send */}
          <Button
            onClick={handleDraftAndSend}
            disabled={!!isProcessing}
            className="px-8 shadow-lg shadow-primary/20"
          >
            {isProcessing === "sending" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {savedDraftId ? "Send Now" : "Draft & Send"}
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8">
          <RecipientSelector
            value={draftData}
            onChange={(val) => {
              setDraftData(val);
              // Reset saved state if they change the audience after saving
              if (savedDraftId) setSavedDraftId(null);
            }}
          />
        </div>

        <aside className="xl:col-span-4 space-y-4 sticky top-6">
          <Card className="p-5 border-dashed bg-muted/30">
            <h3 className="text-xs font-bold uppercase text-muted-foreground mb-4 flex items-center gap-2">
              <Info className="h-3 w-3" /> Template Preview
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-background rounded border text-sm font-semibold">
                Sub: {template.templatePayload.subject}
              </div>
              <div
                className="p-4 bg-background rounded border text-xs prose prose-slate max-h-60 overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html: convertHtmlVariablesToUpperCase(
                    template?.templatePayload?.bodyHtml ?? "",
                  ),
                }}
              />
            </div>
          </Card>

          {savedDraftId && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-700 text-sm">
              <Save className="h-4 w-4" />
              Draft created successfully
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
