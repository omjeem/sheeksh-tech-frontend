"use client";
import { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTeachers } from "@/hooks/useTeachers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherSchema, type TeacherForm } from "@/types/teacher";
import type { TeacherItem } from "@/types/teacher";
import type { ParsedTeacher } from "@/components/teachers/upload-modal";
import { DataTable } from "@/components/common/data-table";
import { CrudDialog } from "@/components/common/crud-dialog";
import { TeacherDialogContent } from "@/components/teachers/teacher-dialog-content";
import { AssignDialog } from "@/components/teachers/assign-dialog";
import TeacherUploadModal from "@/components/teachers/upload-modal";
import { teacherService } from "@/services/teacherService";
import { toDDMMYYYY } from "@/lib/utils";
import useSWR, { mutate } from "swr";
import { useClasses } from "@/hooks/useClasses";
import { useSections } from "@/hooks/useSections";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baseColumns = [
  {
    header: "Name",
    accessor: (t: TeacherItem) => `${t.firstName} ${t.lastName || ""}`,
  },
  { header: "Email", accessor: "email" as const },
  { header: "Designation", accessor: "designation" as const },
  {
    header: "Start Date",
    accessor: (t: TeacherItem) =>
      t.startDate ? new Date(t.startDate).toLocaleDateString() : "—",
  },
  {
    header: "End Date",
    accessor: (t: TeacherItem) =>
      t.endDate ? new Date(t.endDate).toLocaleDateString() : "Ongoing",
  },
];

const extendedColumns = [
  {
    header: "Class",
    accessor: (t: FlattenedTeacher) => t.className,
  },
  {
    header: "Section",
    accessor: (t: FlattenedTeacher) => t.sectionName,
  },
  {
    header: "Subject",
    accessor: (t: FlattenedTeacher) => t.subjectName,
  },
  {
    header: "Session",
    accessor: (t: FlattenedTeacher) => t.sessionName,
  },
  {
    header: "Status",
    accessor: (t: FlattenedTeacher) => (t.isActive ? "Active" : "Inactive"),
  },
];

export default function TeachersPage() {
  const [teacherDialogOpen, setTeacherDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherItem | null>(
    null,
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(
    null,
  );

  const { data: classes } = useClasses();
  const { data: sections } = useSections(selectedClassId);

  const hasFilter = selectedClassId || selectedSectionId || selectedTeacherId;

  const swrKey = hasFilter
    ? `teachers/mapping/${selectedClassId}/${selectedSectionId}/${selectedTeacherId}`
    : null;
  const { data: assignedTeachers, isLoading: mappingLoading } = useSWR(
    swrKey,
    () =>
      teacherService.getMapping({
        classId: selectedClassId,
        sectionId: selectedSectionId,
        teacherId: selectedTeacherId,
      }),
  );

  const {
    data: allTeachers,
    isLoading: allLoading,
    create,
    update,
    remove,
    mutate: mutateAll,
  } = useTeachers();

  const teachers = hasFilter ? assignedTeachers || [] : allTeachers || [];
  const isLoading = hasFilter ? mappingLoading : allLoading;
  const columns = hasFilter
    ? [...baseColumns, ...extendedColumns]
    : baseColumns;

  useEffect(() => {
    setSelectedSectionId(null);
  }, [selectedClassId]);

  const form = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      designation: "TGT",
      dateOfBirth: new Date().toDateString(),
      startDate: new Date().toDateString(),
      endDate: undefined,
    },
  });

  const handleTeacherSubmit = async (data: TeacherForm) => {
    try {
      setIsCreatingTeacher(true);
      if (data?.password && data?.password?.length < 6) {
        toast.error("Password can be undefined or more that 6 chars!");
        return;
      }

      const payload = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName || undefined,
        designation: data.designation,
        phone: data?.phone,
        dateOfBirth: toDDMMYYYY(new Date(data.dateOfBirth)),
        startDate: toDDMMYYYY(new Date(data.startDate)),
        endDate: data.endDate ? toDDMMYYYY(new Date(data.endDate)) : undefined,
      };
      if (editingTeacher) {
        await update(editingTeacher.id, payload);
      } else {
        await create(payload);
      }
      // Mutate the current view
      if (selectedClassId && selectedSectionId) {
        await mutate(swrKey);
      } else {
        await mutateAll();
      }
      setTeacherDialogOpen(false);
      setEditingTeacher(null);
      form.reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Operation failed";
      console.log("errr", err);
      toast.error(errorMessage);
    } finally {
      setIsCreatingTeacher(false);
    }
  };

  const handleBulkImport = async (parsed: ParsedTeacher[]) => {
    const payload = parsed.map((t) => ({
      email: t.email?.trim() || "",
      password: t.password?.trim() || undefined,
      firstName: t.firstName.trim(),
      lastName: t.lastName?.trim() || undefined,
      designation: t.designation,
      phone: t.phone,
      dateOfBirth: t.dateOfBirth, // Already DD-MM-YYYY
      startDate: t.startDate, // Already DD-MM-YYYY
      endDate: t.endDate || undefined,
    }));
    try {
      await teacherService.create(payload);
      toast.success(`${payload.length} teachers imported`);
      // Mutate the current view (bulk import affects all)
      await mutateAll();
      if (selectedClassId && selectedSectionId) {
        await mutate(swrKey);
      }
      setUploadOpen(false);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Import failed";
      toast.error(errorMessage);
    }
  };

  const openCreateTeacher = () => {
    setEditingTeacher(null);
    form.reset();
    setTeacherDialogOpen(true);
  };

  // const openEditTeacher = (teacher: TeacherItem) => {
  //   setEditingTeacher(teacher);
  //   form.reset({
  //     email: teacher.email,
  //     password: "",
  //     firstName: teacher.firstName,
  //     lastName: teacher.lastName || "",
  //     designation: teacher.designation,
  //     dateOfBirth: parseDate(teacher.dateOfBirth) || new Date(),
  //     startDate: parseDate(teacher.startDate) || new Date(),
  //     endDate: teacher.endDate
  //       ? parseDate(teacher.endDate) || undefined
  //       : undefined,
  //   });
  //   setTeacherDialogOpen(true);
  // };

  // const handleDelete = async (id: string) => {
  //   if (!confirm("Delete this teacher?")) return;
  //   await remove(id);
  //   // Mutate the current view
  //   if (selectedClassId && selectedSectionId) {
  //     await mutate(swrKey);
  //   } else {
  //     await mutateAll();
  //   }
  // };

  const openAssign = () => setAssignDialogOpen(true);

  const resetFilters = () => {
    setSelectedClassId(null);
    setSelectedSectionId(null);
    setSelectedTeacherId(null);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 overflow-auto max-w-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Teachers
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUploadOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" /> Bulk Upload
          </Button>
          <Button onClick={openCreateTeacher}>
            <Plus className="w-4 h-4 mr-2" /> Add Teacher
          </Button>
          <Button variant="outline" size="sm" onClick={openAssign}>
            Assign Class
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-end">
        <Select
          value={selectedTeacherId || ""}
          onValueChange={setSelectedTeacherId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Teacher" />
          </SelectTrigger>
          <SelectContent>
            {allTeachers?.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t?.firstName + " " + t?.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedClassId || ""}
          onValueChange={setSelectedClassId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {classes?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedSectionId || ""}
          onValueChange={setSelectedSectionId}
          disabled={!selectedClassId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Section" />
          </SelectTrigger>
          <SelectContent>
            {sections?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        // onEdit={openEditTeacher}
        // onDelete={handleDelete}
      />

      {/* Teacher Dialog */}
      <CrudDialog
        isLoading={isCreatingTeacher}
        open={teacherDialogOpen}
        onOpenChange={setTeacherDialogOpen}
        title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        form={form}
        onSubmit={handleTeacherSubmit}
      >
        <TeacherDialogContent form={form} editing={!!editingTeacher} />
      </CrudDialog>

      {/* Assign Dialog */}
      <AssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        teachers={allTeachers || []} // Use all teachers for assignment
        onSubmit={async (data) => {
          try {
            const payload = {
              teacherId: data.teacherId,
              classId: data.classId,
              sessionId: data.sessionId,
              sectionId: data.sectionId || undefined,
              subjectId: data.subjectId || undefined,
              fromDate: toDDMMYYYY(data.fromDate),
            };
            await teacherService.createClassMap(payload);
            toast.success("Class assigned successfully");
            // Mutate if current filters match the assigned class/section
            if (
              selectedClassId === data.classId &&
              (!data.sectionId || selectedSectionId === data.sectionId)
            ) {
              await mutate(swrKey);
            }
            setAssignDialogOpen(false);
          } catch (err) {
            const error = err as Error;
            toast.error(error?.message);
          }
        }}
      />

      {/* Bulk Upload */}
      <TeacherUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onConfirm={handleBulkImport}
      />
    </div>
  );
}

// Helper function for date parsing (reuse from utils if possible)
function parseDate(str: string): Date | null {
  const [day, month, year] = str.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}
