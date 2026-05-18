"use client";
import { useState } from "react";
import { BookOpen, Plus, Search, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { classSchema, type ClassForm } from "@/types/class";
import type { ClassDto } from "@/types";
import { CrudDialog } from "@/components/common/crud-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClasses } from "@/hooks/useClasses";
import { ClassRow } from "@/components/classes/class-row";
import { SectionCrudDialog } from "@/components/classes/section-crud-dialog";
import type { SectionItem } from "@/types/section";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesPage() {
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(
    null,
  );
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const {
    data: classes,
    isLoading: loadingClasses,
    create: createClass,
    update: updateClass,
    remove: removeClass,
  } = useClasses();

  const classForm = useForm<ClassForm>({ resolver: zodResolver(classSchema) });

  const handleClassSubmit = async (data: ClassForm) => {
    try {
      if (editingClass) {
        await updateClass(editingClass.id, { name: data.name });
      } else {
        await createClass({ name: data.name });
      }
      setClassDialogOpen(false);
      setEditingClass(null);
      classForm.reset();
    } catch (err: unknown) {
      console.error("Class operation failed:", err);
    }
  };

  const handleAddSection = (clsId: string) => {
    setSelectedClassId(clsId);
    setEditingSection(null);
    setSectionDialogOpen(true);
  };

  const handleEditSection = (s: SectionItem) => {
    setSelectedClassId(s.classId);
    setEditingSection(s);
    setSectionDialogOpen(true);
  };

  const handleCloseSectionDialog = () => {
    setSectionDialogOpen(false);
    setEditingSection(null);
    setSelectedClassId(null);
  };

  const handleDeleteClass = (clsId: string) => {
    removeClass(clsId);
  };

  const handleEditClass = (cls: ClassDto) => {
    setEditingClass(cls);
    classForm.reset({ name: cls.name });
    setClassDialogOpen(true);
  };

  const filtered = (classes ?? []).filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        title="Classes & Sections"
        subtitle="Configure grades and sections for the active session."
        breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: "Classes" }]}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Upload size={14} /> Bulk import
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setEditingClass(null);
                classForm.reset();
                setClassDialogOpen(true);
              }}
            >
              <Plus size={14} /> Add class
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative w-full sm:w-[320px]">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search class or section"
            className="pl-9"
          />
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {loadingClasses ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No classes yet"
            description="Create your first class to start managing sections, students, and timetables."
            action={
              <Button
                size="sm"
                onClick={() => {
                  setEditingClass(null);
                  classForm.reset();
                  setClassDialogOpen(true);
                }}
              >
                <Plus size={14} /> Add class
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead style={{ width: 32 }}></TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Students</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cls) => (
                <ClassRow
                  key={cls.id}
                  classItem={cls}
                  onEditClass={() => handleEditClass(cls)}
                  onDeleteClass={() => handleDeleteClass(cls.id)}
                  onAddSection={() => handleAddSection(cls.id)}
                  onEditSection={handleEditSection}
                />
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CrudDialog
        isLoading={classForm.formState.isSubmitting}
        open={classDialogOpen}
        onOpenChange={setClassDialogOpen}
        title={editingClass ? "Edit class" : "Create class"}
        description="Add a new grade to the active session."
        submitLabel={editingClass ? "Save changes" : "Create class"}
        form={classForm}
        onSubmit={handleClassSubmit}
      >
        <div>
          <Label htmlFor="class-name">Class name</Label>
          <Input
            id="class-name"
            {...classForm.register("name")}
            placeholder="e.g. Class 10"
          />
          {classForm.formState.errors.name && (
            <p className="text-[13px] text-danger-ink mt-1.5">
              {classForm.formState.errors.name.message}
            </p>
          )}
        </div>
      </CrudDialog>

      <SectionCrudDialog
        open={sectionDialogOpen}
        onOpenChange={handleCloseSectionDialog}
        editingSection={editingSection}
        classIdForCreate={selectedClassId}
        classes={classes}
      />
    </>
  );
}
