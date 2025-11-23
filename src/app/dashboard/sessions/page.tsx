"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useSessions } from "@/hooks/useSessions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { sessionSchema, type SessionForm } from "@/types/session";
import type { SessionItem } from "@/types/session";

import { DataTable } from "@/components/common/data-table";
import { CrudDialog } from "@/components/common/crud-dialog";
import { SessionDialogContent } from "@/components/session/session-dialog-content";
import { format } from "date-fns";

const columns = [
  { header: "Name", accessor: "name" as const },
  {
    header: "Start Date",
    accessor: (s: SessionItem) => format(new Date(s.startDate), "PPP"),
  },
  {
    header: "End Date",
    accessor: (s: SessionItem) => format(new Date(s.endDate), "PPP"),
  },
  {
    header: "Active",
    accessor: (s: SessionItem) => (s.isActive ? "Yes" : "No"),
  },
];

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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Sessions
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Session
        </Button>
      </div>

      <DataTable
        data={sessions}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEdit}
        // onDelete={remove}
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            setEditingSession(null);
            form.reset();
          }
        }}
        title={editingSession ? "Edit Session" : "Create Session"}
        form={form}
        onSubmit={handleSubmit}
      >
        <SessionDialogContent isEditing={!!editingSession} form={form} />
      </CrudDialog>
    </div>
  );
}
