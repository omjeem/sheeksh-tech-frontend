"use client";
import { useState } from "react";
import { Plus, Upload } from "lucide-react";
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

export default function StudentsPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [mappingStudent, setMappingStudent] = useState<StudentItem | null>(
    null,
  );

  const { data: classes, isLoading: loadingClasses } = useClasses();
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
  // Reset form when section changes or editing
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
          toast.error("Password can be undefined or more that 6 chars!");
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
  const openEdit = (student: StudentItem) => {
    setEditingStudent(student);
    form.reset({
      sectionId: student.sectionId,
      sessionId: student.sessionId || "",
      firstName: student.firstName,
      lastName: student.lastName || "",
      email: student.email || "",
      password: "",
      dateOfBirth: student.dateOfBirth || "",
    });
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col h-full gap-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Students
        </h1>
      </div>
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
      <div className="flex-1 bg-card rounded-lg shadow-sm border overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            Students List
            {selectedSection && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({classes.find((c) => c.id === selectedClass)?.name} -{" "}
                {sections.find((s) => s.id === selectedSection)?.name})
              </span>
            )}
          </h3>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUploadOpen(true)}
              disabled={!selectedSection}
            >
              <Upload className="w-4 h-4 mr-2" /> Bulk Upload
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
              onClick={openCreate}
              disabled={!selectedSection}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Student
            </Button>
          </div>
        </div>
        <StudentsTable
          students={students}
          isLoading={loadingStudents}
          // onEdit={openEdit}
          // onDelete={async (id) => {
          //   if (!confirm("Delete this student?")) return;
          //   await studentService.remove(id);
          //   toast.success("Student deleted");
          //   mutate();
          // }}
          onManageGuardians={(student) => setMappingStudent(student)}
        />
      </div>
      {/* Create/Edit Dialog */}
      <CrudDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        form={form}
        onSubmit={handleSubmit}
      >
        <StudentDialogContent form={form} sections={sections} />
      </CrudDialog>

      {/* Bulk Upload */}
      <StudentUploadModal
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onConfirm={handleBulkImport}
        selectedClass={selectedClass}
        selectedSection={selectedSection}
      />
      {/* Add the Mapping Modal */}
      <GuardianMappingModal
        student={mappingStudent}
        open={!!mappingStudent}
        onOpenChange={(open) => !open && setMappingStudent(null)}
      />
    </div>
  );
}
