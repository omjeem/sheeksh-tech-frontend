"use client";
import { useState } from "react";
import { Download, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useClasses } from "@/hooks/useClasses";
import { useSections } from "@/hooks/useSections";
import { useStudents } from "@/hooks/useStudents";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, type StudentForm } from "@/types/student";
import type { ParsedStudent, StudentItem } from "@/types/student";
import { SectionSelector } from "@/components/students/section-selector";
import { StudentsTable } from "@/components/students/students-table";
import StudentUploadModal from "@/components/students/UploadModal";
import { CrudDialog } from "@/components/common/crud-dialog";
import { studentService } from "@/services/studentService";
import { StudentDialogContent } from "@/components/students/student-dialog-content";
import { toDDMMYYYY } from "@/lib/utils";
import { GuardianMappingModal } from "@/components/guardians/GuardiansMappingModal";
import PageHeader from "@/components/common/page-header";

export default function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [mappingStudent, setMappingStudent] = useState<StudentItem | null>(
    null,
  );

  const { data: classes } = useClasses();
  const { data: sections } = useSections(selectedClass);
  const {
    students,
    isLoading: loadingStudents,
    mutate,
  } = useStudents(selectedClass, selectedSection);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(
    null,
  );
  const [uploadOpen, setUploadOpen] = useState(false);
  const form = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      sectionId: selectedSection || "",
      sessionId: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      dateOfBirth: "",
      phone: "",
    },
  });
  if (selectedSection && form.watch("sectionId") !== selectedSection) {
    form.setValue("sectionId", selectedSection);
  }

  const handleSubmit = async (data: StudentForm) => {
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.id, data);
        toast.success("Student updated");
      } else {
        if (!data.sessionId) {
          toast.error("Session ID is required!");
          return;
        }
        if (data?.password && data?.password?.length < 6) {
          toast.error("Password can be undefined or more than 6 chars!");
          return;
        }
        const payload = {
          classId: selectedClass!,
          sectionId: data.sectionId,
          sessionId: data.sessionId,
          selfAssignSr: true,
          studentData: [
            {
              srNo: 0,
              firstName: data.firstName,
              lastName: data.lastName || "",
              email: data.email,
              password: data.password,
              phone: data.phone || "",
              dateOfBirth: data.dateOfBirth
                ? toDDMMYYYY(new Date(data.dateOfBirth))
                : undefined,
            },
          ],
        };
        await studentService.create(payload);
        toast.success("Student created");
      }
      mutate();
      setDialogOpen(false);
      setEditingStudent(null);
      form.reset();
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Operation failed");
    }
  };

  const handleBulkImport = async (
    parsed: ParsedStudent[],
    sessionId: string,
  ) => {
    if (!selectedSection || !selectedClass)
      throw new Error("Section not selected");
    const payload = {
      classId: selectedClass,
      sectionId: selectedSection,
      sessionId,
      selfAssignSr: true,
      studentData: parsed.map((s) => ({
        srNo: 0,
        firstName: s.firstName,
        lastName: s.lastName || "",
        email: s.email,
        phone: s.phone || "",
        password: s.password || Math.random().toString(36).slice(-8),
        dateOfBirth: s.dateOfBirth,
      })),
    };
    await studentService.create(payload);
    await mutate();
  };

  const openCreate = () => {
    if (!selectedSection) return toast.error("Please select a section first");
    setEditingStudent(null);
    form.reset({ ...form.getValues(), sectionId: selectedSection });
    setDialogOpen(true);
  };

  const className = classes.find((c) => c.id === selectedClass)?.name;
  const sectionName = sections.find((s) => s.id === selectedSection)?.name;

  return (
    <>
      <PageHeader
        title="Students"
        subtitle={
          selectedSection
            ? `Showing ${students.length} students in ${className} · ${sectionName}`
            : "Select a class and section to view students."
        }
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Students" },
        ]}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setUploadOpen(true)}
              disabled={!selectedSection}
            >
              <Upload size={14} /> Bulk upload
            </Button>
            <Button variant="secondary" size="sm" disabled={!selectedSection}>
              <Download size={14} /> Export
            </Button>
            <Button size="sm" onClick={openCreate} disabled={!selectedSection}>
              <Plus size={14} /> Add student
            </Button>
          </>
        }
      />

      <SectionSelector
        selectedClass={selectedClass}
        classes={classes}
        sections={sections}
        selectedSection={selectedSection}
        onSelectClass={(id) => {
          setSelectedClass(id);
          setSelectedSection(null);
        }}
        onSelectSection={setSelectedSection}
      />

      <div className="mt-4 bg-surface border border-border rounded-xl overflow-hidden">
        <StudentsTable
          students={students}
          isLoading={loadingStudents}
          onManageGuardians={(student) => setMappingStudent(student)}
        />
      </div>

      <CrudDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingStudent ? "Edit student" : "Add new student"}
        submitLabel={editingStudent ? "Save changes" : "Add student"}
        form={form}
        onSubmit={handleSubmit}
        size="lg"
      >
        <StudentDialogContent form={form} sections={sections} />
      </CrudDialog>

      <StudentUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onConfirm={handleBulkImport}
        selectedClass={selectedClass}
        selectedSection={selectedSection}
      />

      <GuardianMappingModal
        student={mappingStudent}
        open={!!mappingStudent}
        onOpenChange={(open) => !open && setMappingStudent(null)}
      />
    </>
  );
}
