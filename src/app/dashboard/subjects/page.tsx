"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWR from "swr";
import { toast } from "sonner";
import { subjectService } from "@/services/subjectService";

type Subject = any;
const subjectSchema = z.object({
  name: z.string().min(1, "Name required"),
});

type SubjectForm = z.infer<typeof subjectSchema>;

export default function SubjectsPage() {
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    data: subjects,
    error,
    isLoading,
    mutate,
  } = useSWR<Subject[]>("subject-list", () => subjectService.list(), {
    revalidateOnFocus: false,
  });

  const form = useForm<SubjectForm>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (editingId && subjects) {
      const sub = subjects.find((s) => s.id === editingId);
      if (sub) form.setValue("name", sub.subject);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingId, subjects]);

  const onSubmit = async (data: SubjectForm) => {
    try {
      if (editingId) {
        await subjectService.update(editingId, data.subject);
        toast.success("Subject updated!");
      } else {
        await subjectService.create({ name: data.name });
        toast.success("Subject created!");
      }
      form.reset();
      setEditingId(null);
      await mutate(); // revalidate
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleEdit = (s: Subject) => {
    setEditingId(s.id);
    form.setValue("name", s.name);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this subject?")) return;
    try {
      await subjectService.remove(id);
      toast.success("Subject deleted");
      await mutate();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Manage Subjects 🧾
        </h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Subject" : "Create Subject"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Subject Name (e.g., English)</Label>
                <Input
                  {...form.register("name")}
                  className="rounded-full mt-1"
                />
                {form.formState.errors.name && (
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
              >
                {editingId ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading...</p>
      ) : error ? (
        <p className="text-center text-destructive">Failed to load subjects.</p>
      ) : !subjects || subjects.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No subjects found. Add one!
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {/*<TableHead>ID</TableHead>*/}
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {subjects.map((s) => (
              <TableRow key={s.id}>
                {/*<TableCell className="max-w-xs truncate">{s.id}</TableCell>*/}
                <TableCell>{s.subject}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEdit(s)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(s.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
