"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CrudDialog } from "@/components/common/crud-dialog";
import { sectionSchema, type SectionForm } from "@/types/section";
import { useSections } from "@/hooks/useSections";
import type { SectionItem } from "@/types/section";
import type { ClassDto } from "@/types";
import { useEffect } from "react";

interface SectionCrudDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSection?: SectionItem | null;
  classIdForCreate?: string | null;
  classes: ClassDto[];
}

export function SectionCrudDialog({
  open,
  onOpenChange,
  editingSection,
  classIdForCreate,
  classes,
}: SectionCrudDialogProps) {
  const isEditing = !!editingSection;
  const resolvedClassId = editingSection?.classId || classIdForCreate;

  const { create, update, mutate } = useSections(resolvedClassId!);
  const form = useForm<SectionForm>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      classId: resolvedClassId!,
      name: editingSection?.name || "",
    },
  });

  const title = isEditing ? "Edit Section" : "Create Section";

  const handleSubmit = async (data: SectionForm) => {
    try {
      if (isEditing) {
        await update(editingSection!.id, { name: data.name });
      } else {
        await create(data);
      }
      mutate();
      onOpenChange(false);
      form.reset();
    } catch (err: unknown) {
      console.error("Section operation failed:", err);
    }
  };

  useEffect(() => {
    if (open && resolvedClassId) {
      form.setValue("classId", resolvedClassId);
    }
  }, [open, resolvedClassId]);

  if (!resolvedClassId && !isEditing) return null;

  return (
    <CrudDialog
      isLoading={form.formState.isSubmitting}
      open={open}
      onOpenChange={(val) => {
        if (!val) {
          form.reset();
        }
        onOpenChange(val);
      }}
      title={title}
      form={form}
      onSubmit={handleSubmit}
    >
      <div className="space-y-4">
        {!isEditing && (
          <div>
            <Label>Class</Label>
            <Select
              value={form.watch("classId") || ""}
              onValueChange={(v) => form.setValue("classId", v)}
            >
              <SelectTrigger className="rounded-full mt-1">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.classId && (
              <p className="text-sm text-destructive mt-1">
                {form.formState.errors.classId.message}
              </p>
            )}
          </div>
        )}
        <div>
          <Label>Section Name</Label>
          <Input
            {...form.register("name")}
            placeholder="e.g. A"
            className="rounded-full mt-1"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
      </div>
    </CrudDialog>
  );
}
