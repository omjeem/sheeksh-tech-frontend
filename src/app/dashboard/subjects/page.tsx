"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useSubjects } from "@/hooks/useSubjects";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { subjectSchema, type SubjectForm } from "@/types/subject";
import type { SubjectItem } from "@/types/subject";

import { DataTable } from "@/components/common/data-table";
import { CrudDialog } from "@/components/common/crud-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const columns = [
  { header: "Name", accessor: "name" as const },
  // { header: "Code", accessor: "code" as const },
];

export default function SubjectsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(
    null,
  );

  const { data: subjects, isLoading, create, update, remove } = useSubjects();

  const form = useForm<SubjectForm>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: "", code: "" },
  });

  const handleSubmit = async (data: SubjectForm) => {
    try {
      if (editingSubject) {
        await update(editingSubject.id, data);
      } else {
        await create(data);
      }
      setDialogOpen(false);
      setEditingSubject(null);
      form.reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Operation failed";
      toast.error(errorMessage);
    }
  };

  const openCreate = () => {
    setEditingSubject(null);
    form.reset();
    setDialogOpen(true);
  };

  const openEdit = (subject: SubjectItem) => {
    setEditingSubject(subject);
    form.reset({ name: subject.name, code: subject.code || "" });
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Subjects
        </h1>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Subject
        </Button>
      </div>

      <DataTable
        data={subjects}
        columns={columns}
        isLoading={isLoading}
        // onEdit={openEdit}
        // onDelete={remove}
      />

      <CrudDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            setEditingSubject(null);
            form.reset();
          }
        }}
        title={editingSubject ? "Edit Subject" : "Create Subject"}
        form={form}
        onSubmit={handleSubmit}
      >
        <div>
          <Label>Subject Name</Label>
          <Input
            {...form.register("name")}
            placeholder="e.g. Mathematics"
            className="mt-1 rounded-full"
          />
          {form.formState.errors.name && (
            <p className="text-destructive text-xs mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        {/*<div>
          <Label>Code (Optional)</Label>
          <Input
            {...form.register("code")}
            placeholder="e.g. MATH"
            className="mt-1 rounded-full"
          />
        </div>*/}
      </CrudDialog>
    </div>
  );
}
