"use client";
import { useState, useEffect } from "react";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import PageHeader from "@/components/common/page-header";
import InitialsAvatar from "@/components/common/initials-avatar";

const baseColumns = [
  {
    header: "Teacher",
    accessor: (t: TeacherItem) => (
      <div className="flex items-center gap-3">
        <InitialsAvatar name={`${t.firstName} ${t.lastName || ""}`} size="md" />
        <div>
          <div className="font-medium text-ink">
            {t.firstName} {t.lastName || ""}
          </div>
          <div className="text-[12px] text-ink-3">{t.email}</div>
        </div>
      </div>
    ),
  },
  {
    header: "Designation",
    accessor: (t: TeacherItem) =>
      t.designation ? <Badge variant="brand">{t.designation}</Badge> : "—",
  },
  {
    header: "Joined",
    accessor: (t: TeacherItem) => (
      <span className="text-ink-3">
        {t.startDate ? new Date(t.startDate).toLocaleDateString() : "—"}
      </span>
    ),
  },
  {
    header: "End",
    accessor: (t: TeacherItem) => (
      <span className="text-ink-3">
        {t.endDate ? new Date(t.endDate).toLocaleDateString() : "Ongoing"}
      </span>
    ),
  },
];

type FlattenedTeacher = TeacherItem & {
  className?: string;
  sectionName?: string;
  subjectName?: string;
  isActive?: boolean;
};

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
    header: "Status",
    accessor: (t: FlattenedTeacher) =>
      t.isActive ? (
        <Badge variant="success" dot>
          Active
        </Badge>
      ) : (
        <Badge>Inactive</Badge>
      ),
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
        toast.error("Password can be undefined or more than 6 chars!");
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
      dateOfBirth: t.dateOfBirth,
      startDate: t.startDate,
      endDate: t.endDate || undefined,
    }));
    try {
      await teacherService.create(payload);
      toast.success(`${payload.length} teachers imported`);
      await mutateAll();
      if (selectedClassId && selectedSectionId) {
        await mutate(swrKey);
      }
      setUploadOpen(false);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Import failed";
      toast.error(errorMessage);
    }
  };

  const openCreateTeacher = () => {
    setEditingTeacher(null);
    form.reset();
    setTeacherDialogOpen(true);
  };

  const resetFilters = () => {
    setSelectedClassId(null);
    setSelectedSectionId(null);
    setSelectedTeacherId(null);
  };

  return (
    <>
      <PageHeader
        title="Teachers"
        subtitle="Staff directory and class assignments."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Teachers" },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setUploadOpen(true)}
            >
              <Upload size={14} /> Bulk upload
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setAssignDialogOpen(true)}
            >
              Assign class
            </Button>
            <Button size="sm" onClick={openCreateTeacher}>
              <Plus size={14} /> Add teacher
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2 mb-4">
        <Select
          value={selectedTeacherId || ""}
          onValueChange={setSelectedTeacherId}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by teacher" />
          </SelectTrigger>
          <SelectContent>
            {allTeachers?.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {`${t?.firstName ?? ""} ${t?.lastName ?? ""}`.trim()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedClassId || ""}
          onValueChange={setSelectedClassId}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All classes" />
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
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All sections" />
          </SelectTrigger>
          <SelectContent>
            {sections?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasFilter && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Reset filters
          </Button>
        )}
      </div>

      <DataTable
        data={teachers}
        columns={columns}
        isLoading={isLoading}
        emptyTitle="No teachers found"
        emptyDescription="Add staff members individually or via bulk upload."
      />

      <CrudDialog
        isLoading={isCreatingTeacher}
        open={teacherDialogOpen}
        onOpenChange={setTeacherDialogOpen}
        title={editingTeacher ? "Edit teacher" : "Add new teacher"}
        submitLabel={editingTeacher ? "Save changes" : "Add teacher"}
        form={form}
        onSubmit={handleTeacherSubmit}
        size="lg"
      >
        <TeacherDialogContent form={form} editing={!!editingTeacher} />
      </CrudDialog>

      <AssignDialog
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        teachers={allTeachers || []}
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

      <TeacherUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onConfirm={handleBulkImport}
      />
    </>
  );
}
