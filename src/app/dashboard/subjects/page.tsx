"use client";

import { useMemo, useState } from "react";
import { BookOpen, MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { useSubjects } from "@/hooks/useSubjects";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { subjectSchema, type SubjectForm } from "@/types/subject";
import type { SubjectItem } from "@/types/subject";

import { CrudDialog } from "@/components/common/crud-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import Tile, { type TileTone } from "@/components/common/tile";
import { Skeleton } from "@/components/ui/skeleton";
import Chip from "@/components/common/chip";

const FILTERS = ["All", "Core", "Languages", "Sciences", "Arts & sports"];

const toneCycle: TileTone[] = [
  "brand",
  "teal",
  "warning",
  "success",
  "info",
  "danger",
];

export default function SubjectsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const { data: subjects, isLoading, create, update } = useSubjects();

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

  const filtered = useMemo(
    () =>
      (subjects ?? []).filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [subjects, search],
  );

  return (
    <>
      <PageHeader
        title="Subjects"
        subtitle="Subject catalogue, mapped to classes and teachers."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Subjects" },
        ]}
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus size={14} /> Add subject
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative w-full sm:w-[300px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subjects"
            className="pl-9"
          />
        </div>
        {FILTERS.map((f) => (
          <Chip
            key={f}
            active={activeFilter === f}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </Chip>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[180px] rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl">
          <EmptyState
            icon={BookOpen}
            title="No subjects yet"
            description="Add subjects to map them to classes and teachers."
            action={
              <Button size="sm" onClick={openCreate}>
                <Plus size={14} /> Add subject
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s, i) => (
            <button
              key={s.id}
              onClick={() => openEdit(s)}
              className="bg-surface border border-border rounded-xl p-5 text-left hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Tile
                  tone={toneCycle[i % toneCycle.length]}
                  icon={BookOpen}
                  size={36}
                />
                <MoreHorizontal size={16} className="text-ink-3" />
              </div>
              <div className="mt-3.5 flex items-baseline gap-2">
                <span className="text-[17px] font-semibold text-ink">
                  {s.name}
                </span>
                {s.code && (
                  <span className="mono text-[11px] text-ink-3 bg-surface-3 px-1.5 py-0.5 rounded">
                    {s.code}
                  </span>
                )}
              </div>
              <div className="mt-2">
                <Badge>Core</Badge>
              </div>
              <div className="h-px bg-divider my-4" />
              <div className="flex gap-6">
                <div>
                  <div className="text-[11px] text-ink-3">Classes</div>
                  <div className="text-[15px] font-semibold tnum">
                    {(s as any).classes ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-ink-3">Teachers</div>
                  <div className="text-[15px] font-semibold tnum">
                    {(s as any).teachers ?? "—"}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <CrudDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) {
            setEditingSubject(null);
            form.reset();
          }
        }}
        title={editingSubject ? "Edit subject" : "Create subject"}
        submitLabel={editingSubject ? "Save changes" : "Create subject"}
        form={form}
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-4">
          <div>
            <Label>Subject name</Label>
            <Input {...form.register("name")} placeholder="e.g. Mathematics" />
            {form.formState.errors.name && (
              <p className="text-danger-ink text-[12px] mt-1.5">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label>Code (optional)</Label>
            <Input {...form.register("code")} placeholder="e.g. MTH" />
          </div>
        </div>
      </CrudDialog>
    </>
  );
}
