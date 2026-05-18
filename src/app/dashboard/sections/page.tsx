"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import PageHeader from "@/components/common/page-header";
import EmptyState from "@/components/common/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

const sectionSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  name: z.string().min(1, "Section name is required"),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface Section {
  id: string;
  classId: string;
  name: string;
  createdAt: string;
  className?: string;
}

interface ClassOption {
  id: string;
  name: string;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: { classId: "", name: "" },
  });

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/class`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setClasses(res.data.data);
    } catch {
      toast.error("Failed to load classes");
    }
  };

  const fetchSections = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/section`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setSections(res.data.data);
    } catch {
      toast.error("Failed to load sections");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SectionFormData) => {
    try {
      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/section/${editingId}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        toast.success("Section updated");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/section`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Section created");
      }
      fetchSections();
      form.reset();
      setEditingId(null);
      setDialogOpen(false);
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this section?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/section/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Section deleted");
      fetchSections();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (sec: Section) => {
    form.setValue("classId", sec.classId);
    form.setValue("name", sec.name);
    setEditingId(sec.id);
    setDialogOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Sections"
        subtitle="Sections grouped by class."
        breadcrumb={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Sections" },
        ]}
        actions={
          <Dialog
            open={dialogOpen}
            onOpenChange={(o) => {
              setDialogOpen(o);
              if (!o) {
                setEditingId(null);
                form.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={14} /> Add section
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit section" : "Create section"}
                </DialogTitle>
              </DialogHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-5 flex flex-col gap-4"
              >
                <div>
                  <Label>Class</Label>
                  <Select
                    value={form.watch("classId") || ""}
                    onValueChange={(val) => form.setValue("classId", val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.classId && (
                    <p className="text-danger-ink text-[12px] mt-1.5">
                      {form.formState.errors.classId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Section name</Label>
                  <Input {...form.register("name")} placeholder="e.g. A" />
                  {form.formState.errors.name && (
                    <p className="text-danger-ink text-[12px] mt-1.5">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>
              </form>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {editingId ? "Save changes" : "Create section"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : sections.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="No sections yet"
            description="Add sections under a class to start grouping students."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((sec) => (
                <TableRow key={sec.id}>
                  <TableCell>{sec.className || sec.classId}</TableCell>
                  <TableCell className="font-medium">{sec.name}</TableCell>
                  <TableCell className="text-ink-3">
                    {new Date(sec.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap w-[1%]">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => handleEdit(sec)}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-danger-ink hover:bg-danger-soft"
                        onClick={() => handleDelete(sec.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
