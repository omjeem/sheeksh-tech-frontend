"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
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

export default function ClassesPage() {
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(
    null,
  );
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const {
    data: classes,
    isLoading: loadingClasses,
    create: createClass,
    update: updateClass,
    remove: removeClass,
  } = useClasses();

  // Forms (class form only; section form now in dialog)
  const classForm = useForm<ClassForm>({ resolver: zodResolver(classSchema) });

  const handleClassSubmit = async (data: ClassForm) => {
    try {
      if (editingClass) {
        await updateClass(editingClass.id, { name: data.name });
      } else {
        await createClass({ name: data.name });
      }
      // Hook handles toast and mutate
      setClassDialogOpen(false);
      setEditingClass(null);
      classForm.reset();
    } catch (err: unknown) {
      // Hook already toasts error; optional extra handling here
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
    // Hook's remove handles confirm, toast, and mutate
    removeClass(clsId);
  };

  const handleEditClass = (cls: ClassDto) => {
    setEditingClass(cls);
    classForm.reset({ name: cls.name });
    setClassDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-8 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Classes & Sections
        </h1>
        <Button
          onClick={() => {
            setEditingClass(null);
            classForm.reset();
            setClassDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Class
        </Button>
      </div>
      {loadingClasses ? (
        <p className="text-muted-foreground">Loading classes…</p>
      ) : classes.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">
          No classes yet. Create one!
        </p>
      ) : (
        <Table className="flex-1 overflow-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classes.map((cls) => (
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
      {/* Class Dialog */}
      <CrudDialog
        isLoading={classForm.formState.isSubmitting}
        open={classDialogOpen}
        onOpenChange={setClassDialogOpen}
        title={editingClass ? "Edit Class" : "Create Class"}
        form={classForm}
        onSubmit={handleClassSubmit}
      >
        <div>
          <Label>Class Name</Label>
          <Input
            {...classForm.register("name")}
            placeholder="e.g. Class 10"
            className="mt-1 rounded-full"
          />
          {classForm.formState.errors.name && (
            <p className="text-sm text-destructive mt-1">
              {classForm.formState.errors.name.message}
            </p>
          )}
        </div>
      </CrudDialog>
      {/* Section Dialog */}
      <SectionCrudDialog
        open={sectionDialogOpen}
        onOpenChange={handleCloseSectionDialog}
        editingSection={editingSection}
        classIdForCreate={selectedClassId}
        classes={classes}
      />
    </div>
  );
}
