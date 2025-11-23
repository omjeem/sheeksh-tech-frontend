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
import { Switch } from "@/components/ui/switch";
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
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const sessionSchema = z.object({
  name: z.string().min(1, "Name required"),
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface Session {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      isActive: false,
    },
  });

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/session`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        },
      );
      setSessions(res.data.data);
    } catch (err) {
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SessionFormData) => {
    try {
      const payload = {
        ...data,
        startDate: format(data.startDate, "yyyy-MM-dd"),
        endDate: format(data.endDate, "yyyy-MM-dd"),
      };
      if (editingId) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API_URL}/session/${editingId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        toast.success("Session updated!");
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/session`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          },
        );
        toast.success("Session created!");
      }
      fetchSessions();
      form.reset();
      setEditingId(null);
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/session/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      toast.success("Session deleted");
      fetchSessions();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (ses: Session) => {
    form.setValue("name", ses.name);
    form.setValue("startDate", new Date(ses.startDate));
    form.setValue("endDate", new Date(ses.endDate));
    form.setValue("isActive", ses.isActive);
    setEditingId(ses.id);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-chart-1 to-chart-2 bg-clip-text text-transparent">
          Manage Sessions 📅
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-chart-1 to-chart-2 text-primary-foreground rounded-full">
              <Plus className="w-4 h-4 mr-2" /> Add Session
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Session" : "Create Session"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Session Name (e.g., 2025-2026)</Label>
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
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-full mt-1 justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("startDate")
                        ? format(form.watch("startDate"), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={form.watch("startDate")}
                      onSelect={(date) => form.setValue("startDate", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full rounded-full mt-1 justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {form.watch("endDate")
                        ? format(form.watch("endDate"), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={form.watch("endDate")}
                      onSelect={(date) => form.setValue("endDate", date!)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={form.watch("isActive")}
                  onCheckedChange={(checked) =>
                    form.setValue("isActive", checked)
                  }
                />
                <Label>Active Session</Label>
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
      ) : sessions.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No sessions found. Add one!
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sessions.map((ses) => (
              <TableRow key={ses.id}>
                <TableCell>{ses.name}</TableCell>
                <TableCell>{format(new Date(ses.startDate), "PPP")}</TableCell>
                <TableCell>{format(new Date(ses.endDate), "PPP")}</TableCell>
                <TableCell>{ses.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEdit(ses)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => handleDelete(ses.id)}
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
