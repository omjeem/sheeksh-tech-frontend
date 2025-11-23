// "use client";
// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Pencil, Trash2, Plus, ChevronDown, ChevronRight } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";
// import { classService } from "@/services/classService";
// import { sectionService } from "@/services/sectionService";
// import { studentService } from "@/services/studentService";
// import { useSWR } from "@/hooks/useSWR";
// import { toDDMMYYYY } from "../teachers/page";
// import { ClassForm, ClassItem, classSchema } from "@/types/class";
// import { SectionForm, SectionItem, sectionSchema } from "@/types/section";
// import useClasses from "@/hooks/useClasses";

// /* ---------- Hooks ---------- */

// /* ---------- Shared Components ---------- */
// function EmptyState({ message }: { message: string }) {
//   return <p className="text-muted-foreground">{message}</p>;
// }

// function Loading({ message = "Loading…" }: { message?: string }) {
//   return <p className="text-muted-foreground">{message}</p>;
// }

// /* ---------- Classes Page ---------- */
// function ClassRow({
//   classItem,
//   sections,
//   loadingSections,
//   onEditClass,
//   onDeleteClass,
//   onAddSection,
//   onEditSection,
//   onDeleteSection,
//   expanded,
//   onToggleExpand,
//   loadingSectionAction,
//   onSelectClassForSection,
// }: {
//   classItem: ClassItem;
//   sections: SectionItem[];
//   loadingSections: boolean;
//   onEditClass: (c: ClassItem) => void;
//   onDeleteClass: (id: string) => void;
//   onAddSection: (classId: string) => void;
//   onEditSection: (s: SectionItem) => void;
//   onDeleteSection: (id: string) => void;
//   expanded: boolean;
//   onToggleExpand: () => void;
//   loadingSectionAction: boolean;
//   onSelectClassForSection: (classId: string) => void;
// }) {
//   return (
//     <>
//       <TableRow
//         onClick={onToggleExpand}
//         className="cursor-pointer hover:bg-muted/50"
//       >
//         <TableCell className="font-medium">
//           <div className="flex items-center gap-2">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onToggleExpand();
//               }}
//             >
//               {expanded ? (
//                 <ChevronDown className="w-4 h-4" />
//               ) : (
//                 <ChevronRight className="w-4 h-4" />
//               )}
//             </Button>
//             {classItem.name}
//           </div>
//         </TableCell>
//         <TableCell className="text-right">
//           <div className="flex gap-1">
//             <Button
//               variant="ghost"
//               size="icon"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onEditClass(classItem);
//               }}
//             >
//               <Pencil className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="text-destructive"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onDeleteClass(classItem.id);
//               }}
//             >
//               <Trash2 className="w-4 h-4" />
//             </Button>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full ml-2"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onAddSection(classItem.id);
//               }}
//               disabled={loadingSectionAction}
//             >
//               <Plus className="w-4 h-4 mr-1" /> Add Section
//             </Button>
//           </div>
//         </TableCell>
//       </TableRow>
//       {expanded && (
//         <TableRow>
//           <TableCell colSpan={2} className="p-0">
//             <div className="p-4 bg-muted/50">
//               {loadingSections ? (
//                 <Loading message="Loading sections…" />
//               ) : sections.length === 0 ? (
//                 <EmptyState message="No sections for this class." />
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead className="w-8"></TableHead>
//                       <TableHead>Section Name</TableHead>
//                       <TableHead>Actions</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {sections.map((s) => (
//                       <TableRow key={s.id}>
//                         <TableCell></TableCell>
//                         <TableCell>{s.name}</TableCell>
//                         <TableCell>
//                           <div className="flex gap-1">
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => onEditSection(s)}
//                             >
//                               <Pencil className="w-4 h-4" />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="text-destructive"
//                               onClick={() => onDeleteSection(s.id)}
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </div>
//           </TableCell>
//         </TableRow>
//       )}
//     </>
//   );
// }

// export default function ClassesPage() {
//   const {
//     classes,
//     isLoading: loadingClasses,
//     create: createClass,
//     update: updateClass,
//     remove: removeClass,
//   } = useClasses();

//   const [expandedClass, setExpandedClass] = useState<string | null>(null);
//   const [sections, setSections] = useState<SectionItem[]>([]);
//   const [loadingSections, setLoadingSections] = useState(false);

//   // Load sections when class is expanded
//   useEffect(() => {
//     if (expandedClass) {
//       setLoadingSections(true);
//       sectionService
//         .list(expandedClass)
//         .then(setSections)
//         .catch(console.error)
//         .finally(() => setLoadingSections(false));
//     }
//   }, [expandedClass]);

//   const [isClassDialogOpen, setClassDialogOpen] = useState(false);
//   const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
//   const [isSectionDialogOpen, setSectionDialogOpen] = useState(false);
//   const [editingSection, setEditingSection] = useState<SectionItem | null>(
//     null,
//   );
//   const [loadingClassAction, setLoadingClassAction] = useState(false);
//   const [loadingSectionAction, setLoadingSectionAction] = useState(false);
//   const [currentClassId, setCurrentClassId] = useState<string | null>(null);

//   const handleClassSubmit = async (values: ClassForm) => {
//     setLoadingClassAction(true);
//     try {
//       if (editingClass) {
//         await updateClass(editingClass.id, { name: values.name });
//         toast.success("Class updated");
//       } else {
//         await createClass({ name: values.name });
//         toast.success("Class created");
//       }
//       setEditingClass(null);
//       setClassDialogOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Operation failed");
//     } finally {
//       setLoadingClassAction(false);
//     }
//   };

//   const handleDeleteClass = async (id: string) => {
//     if (!confirm("Delete this class? All sections will be removed.")) return;
//     setLoadingClassAction(true);
//     try {
//       await removeClass(id);
//       toast.success("Class deleted");
//       if (expandedClass === id) {
//         setExpandedClass(null);
//         setSections([]);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Delete failed");
//     } finally {
//       setLoadingClassAction(false);
//     }
//   };

//   const handleSectionSubmit = async (values: SectionForm) => {
//     setLoadingSectionAction(true);
//     try {
//       if (editingSection) {
//         await sectionService.update(editingSection.id, {
//           name: values.name,
//           classId: values.classId,
//         });
//         toast.success("Section updated");
//         // Reload sections if current
//         if (values.classId === expandedClass) {
//           const updatedSections = await sectionService.list(values.classId);
//           setSections(updatedSections);
//         }
//       } else {
//         await sectionService.create(values);
//         toast.success("Section created");
//         if (values.classId === expandedClass) {
//           const updatedSections = await sectionService.list(values.classId);
//           setSections(updatedSections);
//         }
//       }
//       setEditingSection(null);
//       setSectionDialogOpen(false);
//     } catch (err) {
//       console.error(err);
//       toast.error("Operation failed");
//     } finally {
//       setLoadingSectionAction(false);
//     }
//   };

//   const handleDeleteSection = async (id: string) => {
//     if (!confirm("Delete this section?")) return;
//     setLoadingSectionAction(true);
//     try {
//       await sectionService.remove(id);
//       toast.success("Section deleted");
//       if (expandedClass) {
//         const updatedSections = await sectionService.list(expandedClass);
//         setSections(updatedSections);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Delete failed");
//     } finally {
//       setLoadingSectionAction(false);
//     }
//   };

//   const openCreateClass = () => {
//     setEditingClass(null);
//     setClassDialogOpen(true);
//   };

//   const openEditClass = (c: ClassItem) => {
//     setEditingClass(c);
//     setClassDialogOpen(true);
//   };

//   const openCreateSection = (classId: string) => {
//     setCurrentClassId(classId);
//     setEditingSection(null);
//     setSectionDialogOpen(true);
//   };

//   const openEditSection = (s: SectionItem) => {
//     setEditingSection(s);
//     setSectionDialogOpen(true);
//   };

//   const toggleExpand = (classId: string) => {
//     setExpandedClass((prev) => (prev === classId ? null : classId));
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
//           Classes
//         </h2>
//         <Button
//           size="sm"
//           className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full"
//           onClick={openCreateClass}
//           disabled={loadingClassAction}
//         >
//           <Plus className="w-4 h-4 mr-1" /> Add Class
//         </Button>
//       </div>
//       {loadingClasses ? (
//         <Loading message="Loading classes…" />
//       ) : classes.length === 0 ? (
//         <EmptyState message="No classes yet." />
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Class</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {classes.map((c) => (
//               <ClassRow
//                 onSelectClassForSection={() => {}}
//                 key={c.id}
//                 classItem={c}
//                 sections={expandedClass === c.id ? sections : []}
//                 loadingSections={loadingSections && expandedClass === c.id}
//                 onEditClass={openEditClass}
//                 onDeleteClass={handleDeleteClass}
//                 onAddSection={openCreateSection}
//                 onEditSection={openEditSection}
//                 onDeleteSection={handleDeleteSection}
//                 expanded={expandedClass === c.id}
//                 onToggleExpand={() => toggleExpand(c.id)}
//                 loadingSectionAction={loadingSectionAction}
//               />
//             ))}
//           </TableBody>
//         </Table>
//       )}
//       <ClassDialog
//         open={isClassDialogOpen}
//         onOpenChange={setClassDialogOpen}
//         defaultValues={editingClass || undefined}
//         onSubmit={handleClassSubmit}
//         loading={loadingClassAction}
//       />
//       <SectionDialog
//         open={isSectionDialogOpen}
//         onOpenChange={setSectionDialogOpen}
//         defaultValues={
//           editingSection ||
//           (currentClassId ? { classId: currentClassId, name: "" } : undefined)
//         }
//         onSubmit={handleSectionSubmit}
//         classes={classes}
//         loading={loadingSectionAction}
//       />
//     </div>
//   );
// }

// function ClassDialog({
//   open,
//   onOpenChange,
//   defaultValues,
//   onSubmit,
//   loading,
// }: any) {
//   const form = useForm<ClassForm>({
//     resolver: zodResolver(classSchema),
//     defaultValues: defaultValues || { name: "" },
//   });
//   useEffect(() => {
//     if (defaultValues) form.reset(defaultValues);
//   }, [defaultValues, form]);
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="rounded-xl">
//         <DialogHeader>
//           <DialogTitle>
//             {defaultValues?.id ? "Edit Class" : "Create Class"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <Label>Class Name</Label>
//             <Input
//               {...form.register("name")}
//               placeholder="e.g. 10"
//               className="rounded-full mt-1"
//               disabled={loading}
//             />
//             {form.formState.errors.name && (
//               <p className="text-destructive text-xs mt-1">
//                 {form.formState.errors.name.message}
//               </p>
//             )}
//           </div>
//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
//             disabled={loading}
//           >
//             {defaultValues?.id ? "Update" : "Create"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function SectionDialog({
//   open,
//   onOpenChange,
//   defaultValues,
//   onSubmit,
//   classes,
//   loading,
// }: any) {
//   const form = useForm<SectionForm>({
//     resolver: zodResolver(sectionSchema),
//     defaultValues: defaultValues || { classId: "", name: "" },
//   });
//   useEffect(() => {
//     if (defaultValues) form.reset(defaultValues);
//   }, [defaultValues, form]);
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="rounded-xl">
//         <DialogHeader>
//           <DialogTitle>
//             {defaultValues?.id ? "Edit Section" : "Create Section"}
//           </DialogTitle>
//         </DialogHeader>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <div>
//             <Label>Class</Label>
//             <Select
//               value={form.watch("classId")}
//               onValueChange={(v: string) => form.setValue("classId", v)}
//             >
//               <SelectTrigger className="rounded-full mt-1">
//                 <SelectValue placeholder="Select class" />
//               </SelectTrigger>
//               <SelectContent>
//                 {classes?.map((c: ClassItem) => (
//                   <SelectItem key={c.id} value={c.id}>
//                     {c.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             {form.formState.errors.classId && (
//               <p className="text-destructive text-xs mt-1">
//                 {form.formState.errors.classId.message}
//               </p>
//             )}
//           </div>
//           <div>
//             <Label>Section Name</Label>
//             <Input
//               {...form.register("name")}
//               placeholder="e.g. A"
//               className="rounded-full mt-1"
//               disabled={loading}
//             />
//             {form.formState.errors.name && (
//               <p className="text-destructive text-xs mt-1">
//                 {form.formState.errors.name.message}
//               </p>
//             )}
//           </div>
//           <Button
//             type="submit"
//             className="w-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
//             disabled={loading}
//           >
//             {defaultValues?.id ? "Update" : "Create"}
//           </Button>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
// app/(dashboard)/classes/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import { classService } from "@/services/classService";
import { sectionService } from "@/services/sectionService";
import { useCRUD } from "@/hooks/useCRUD";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { classSchema, type ClassForm } from "@/types/class";
import { sectionSchema, type SectionForm } from "@/types/section";
import type { ClassDto } from "@/types";
import type { SectionItem } from "@/types/section";

import { CrudDialog } from "@/components/common/crud-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Reusable Section Row Component
function SectionRow({
  section,
  onEdit,
  onDelete,
}: {
  section: SectionItem;
  onEdit: (s: SectionItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <TableRow>
      <TableCell></TableCell>
      <TableCell>{section.name}</TableCell>
      {/*<TableCell>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(section)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>*/}
    </TableRow>
  );
}

// Main Expandable Class Row
function ClassRow({
  classItem,
  isExpanded,
  sections,
  isLoadingSections,
  onToggle,
  onEditClass,
  onDeleteClass,
  onAddSection,
  onEditSection,
  onDeleteSection,
}: {
  classItem: ClassDto;
  isExpanded: boolean;
  sections: SectionItem[];
  isLoadingSections: boolean;
  onToggle: () => void;
  onEditClass: () => void;
  onDeleteClass: () => void;
  onAddSection: () => void;
  onEditSection: (s: SectionItem) => void;
  onDeleteSection: (id: string) => void;
}) {
  return (
    <>
      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={onToggle}>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
            {classItem.name}
          </div>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            {/*<Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onEditClass();
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClass();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>*/}
            <Button
              size="sm"
              className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full ml-2"
              onClick={(e) => {
                e.stopPropagation();
                onAddSection();
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Section
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow>
          <TableCell colSpan={2} className="p-0">
            <div className="p-4 bg-muted/50 border-t">
              {isLoadingSections ? (
                <p className="text-muted-foreground">Loading sections…</p>
              ) : sections.length === 0 ? (
                <p className="text-muted-foreground">No sections yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Section Name</TableHead>
                      {/*<TableHead>Actions</TableHead>*/}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((s) => (
                      <SectionRow
                        key={s.id}
                        section={s}
                        onEdit={onEditSection}
                        onDelete={onDeleteSection}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default function ClassesPage() {
  const [expandedClassId, setExpandedClassId] = useState<string | null>(null);
  const [sections, setSections] = useState<Record<string, SectionItem[]>>({});
  const [loadingSectionsFor, setLoadingSectionsFor] = useState<string | null>(
    null,
  );

  const {
    data: classes,
    isLoading: loadingClasses,
    mutate,
  } = useCRUD({
    key: "/class",
    listFn: classService.list,
    createFn: classService.create,
    updateFn: classService.update,
    deleteFn: classService.remove,
  });

  // Load sections when a class is expanded
  useEffect(() => {
    if (expandedClassId && !sections[expandedClassId]) {
      setLoadingSectionsFor(expandedClassId);
      sectionService
        .list(expandedClassId)
        .then((data) => {
          setSections((prev) => ({ ...prev, [expandedClassId]: data }));
        })
        .finally(() => setLoadingSectionsFor(null));
    }
  }, [expandedClassId]);

  // Dialog states
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassDto | null>(null);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(
    null,
  );
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  // Forms
  const classForm = useForm<ClassForm>({ resolver: zodResolver(classSchema) });
  const sectionForm = useForm<SectionForm>({
    resolver: zodResolver(sectionSchema),
  });

  const handleClassSubmit = async (data: ClassForm) => {
    if (editingClass) {
      await classService.update(editingClass.id, data);
      toast.success("Class updated");
    } else {
      await classService.create(data);
      toast.success("Class created");
    }
    mutate();
    setClassDialogOpen(false);
    setEditingClass(null);
    classForm.reset();
  };

  const handleSectionSubmit = async (data: SectionForm) => {
    if (editingSection) {
      await sectionService.update(editingSection.id, data);
      toast.success("Section updated");
    } else {
      await sectionService.create(data);
      toast.success("Section created");
    }
    // Refresh sections
    if (data.classId) {
      const updated = await sectionService.list(data.classId);
      setSections((prev) => ({ ...prev, [data.classId]: updated }));
    }
    setSectionDialogOpen(false);
    setEditingSection(null);
    sectionForm.reset();
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    await sectionService.remove(id);
    toast.success("Section deleted");
    if (expandedClassId) {
      const updated = await sectionService.list(expandedClassId);
      setSections((prev) => ({ ...prev, [expandedClassId]: updated }));
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
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
        <Table>
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
                isExpanded={expandedClassId === cls.id}
                sections={sections[cls.id] || []}
                isLoadingSections={loadingSectionsFor === cls.id}
                onToggle={() =>
                  setExpandedClassId(expandedClassId === cls.id ? null : cls.id)
                }
                onEditClass={() => {
                  setEditingClass(cls);
                  classForm.reset({ name: cls.name });
                  setClassDialogOpen(true);
                }}
                onDeleteClass={async () => {
                  if (!confirm("Delete class and all its sections?")) return;
                  await classService.remove(cls.id);
                  toast.success("Class deleted");
                  mutate();
                  if (expandedClassId === cls.id) setExpandedClassId(null);
                }}
                onAddSection={() => {
                  setSelectedClassId(cls.id);
                  setEditingSection(null);
                  sectionForm.reset({ classId: cls.id, name: "" });
                  setSectionDialogOpen(true);
                }}
                onEditSection={(s) => {
                  setEditingSection(s);
                  sectionForm.reset({ classId: s.classId, name: s.name });
                  setSectionDialogOpen(true);
                }}
                onDeleteSection={handleDeleteSection}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {/* Class Dialog */}
      <CrudDialog
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
      <CrudDialog
        open={sectionDialogOpen}
        onOpenChange={setSectionDialogOpen}
        title={editingSection ? "Edit Section" : "Create Section"}
        form={sectionForm}
        onSubmit={handleSectionSubmit}
      >
        <div className="space-y-4">
          <div>
            <Label>Class</Label>
            <Select
              value={sectionForm.watch("classId")}
              onValueChange={(v) => sectionForm.setValue("classId", v)}
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
          </div>
          <div>
            <Label>Section Name</Label>
            <Input
              {...sectionForm.register("name")}
              placeholder="e.g. A"
              className="rounded-full mt-1"
            />
            {sectionForm.formState.errors.name && (
              <p className="text-sm text-destructive mt-1">
                {sectionForm.formState.errors.name.message}
              </p>
            )}
          </div>
        </div>
      </CrudDialog>
    </div>
  );
}
