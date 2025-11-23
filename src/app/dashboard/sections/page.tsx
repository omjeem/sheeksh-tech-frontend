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
import { Pencil, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";

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
  className?: string; // For display
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
    } catch (err) {
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
      setSections(res.data.data); // Assume data includes className for join
    } catch (err) {
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
        toast.success("Section updated!");
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/section`, data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        toast.success("Section created!");
      }
      fetchSections();
      form.reset();
      setEditingId(null);
    } catch (err) {
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
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (sec: Section) => {
    form.setValue("classId", sec.classId);
    form.setValue("name", sec.name);
    setEditingId(sec.id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Manage Sections 🗂️
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Add Section
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Section" : "Create Section"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Class</Label>
                <Select onValueChange={(val) => form.setValue("classId", val)}>
                  <SelectTrigger className="rounded-full mt-1">
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
                  <p className="text-destructive text-xs mt-1">
                    {form.formState.errors.classId.message}
                  </p>
                )}
              </div>
              <div>
                <Label>Section Name</Label>
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
      ) : sections.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No sections found. Add one!
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Class</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map((sec) => (
              <TableRow key={sec.id}>
                <TableCell>{sec.className || sec.classId}</TableCell>
                <TableCell>{sec.name}</TableCell>
                <TableCell>
                  {new Date(sec.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEdit(sec)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(sec.id)}
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
