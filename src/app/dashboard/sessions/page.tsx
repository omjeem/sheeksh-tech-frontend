"use client";

import { useState } from "react";
import { ArrowRight, ArrowUpRight, Eye, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { useSessions } from "@/hooks/useSessions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { sessionSchema, type SessionForm } from "@/types/session";
import type { SessionItem } from "@/types/session";

import { CrudDialog } from "@/components/common/crud-dialog";
import { SessionDialogContent } from "@/components/session/session-dialog-content";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import Tile from "@/components/common/tile";
import { Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function SessionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionItem | null>(
    null,
  );

  const { data: sessions, isLoading, create, update, remove } = useSessions();

  const form = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "",
      startDate: new Date().toDateString(),
      endDate: new Date().toDateString(),
      isActive: false,
    },
  });

  const handleSubmit = async (data: SessionForm) => {
    try {
      const payload = {
        name: data.name,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
        isActive: data.isActive,
      };

      if (editingSession) {
        await update(editingSession.id, payload);
      } else {
        await create(payload);
      }
      setDialogOpen(false);
      setEditingSession(null);
      form.reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Operation failed";
      toast.error(errorMessage);
    }
  };

  const openCreate = () => {
    setEditingSession(null);
    form.reset();
    setDialogOpen(true);
  };

  const openEdit = (session: SessionItem) => {
    setEditingSession(session);
    form.reset({
      name: session.name,
      startDate: new Date(session.startDate).toDateString(),
      endDate: new Date(session.endDate).toDateString(),
      isActive: session.isActive,
    });
    setDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Sessions"
        subtitle="Academic years and their active windows."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sessions" },
        ]}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} /> New session
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[260px] rounded-xl" />
          ))}
        </div>
      ) : !sessions || sessions.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon={Calendar}
            title="No sessions yet"
            description="Create an academic session to start managing classes, timetables, and admissions."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus size={14} /> New session
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="bg-surface border border-border rounded-xl flex flex-col relative"
            >
              <span className="absolute top-4 right-4">
                {s.isActive ? (
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                ) : (
                  <Badge>Archived</Badge>
                )}
              </span>
              <div className="p-5">
                <div className="eyebrow">Academic year</div>
                <div className="serif italic text-[30px] mt-2 tracking-tight">
                  {s.name}
                </div>
                <div className="flex gap-6 mt-5">
                  <div>
                    <div className="text-[12px] text-ink-3">Starts</div>
                    <div className="text-[13px] font-medium">
                      {format(new Date(s.startDate), "MMM d, yyyy")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[12px] text-ink-3">Ends</div>
                    <div className="text-[13px] font-medium">
                      {format(new Date(s.endDate), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-divider px-5 py-3 mt-auto bg-bg-2 flex justify-end gap-2">
                {s.isActive ? (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                      <Pencil size={13} /> Edit
                    </Button>
                    <Button size="sm" variant="soft">
                      Open <ArrowRight size={13} />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                      <Eye size={13} /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger-ink"
                      onClick={() => remove(s.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promote students callout */}
      <div className="mt-6 bg-info-soft border border-info/15 rounded-xl p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Tile tone="info" icon={ArrowUpRight} size={40} />
          <div>
            <div className="font-semibold text-[15px] text-info-ink">
              Promote students to the new session
            </div>
            <div className="text-[13px] text-info-ink/80">
              Students are eligible after the active session ends.
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost">
            Preview rules
          </Button>
          <Button size="sm">Start promotion</Button>
        </div>
      </div>

      <CrudDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            setEditingSession(null);
            form.reset();
          }
        }}
        title={editingSession ? "Edit session" : "Create session"}
        description="Configure an academic year window."
        submitLabel={editingSession ? "Save changes" : "Create session"}
        form={form}
        onSubmit={handleSubmit}
      >
        <SessionDialogContent isEditing={!!editingSession} form={form} />
      </CrudDialog>
    </>
  );
}
