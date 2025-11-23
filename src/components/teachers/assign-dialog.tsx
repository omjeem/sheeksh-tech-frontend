import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { classService } from "@/services/classService";
import { sectionService } from "@/services/sectionService";
import { subjectService } from "@/services/subjectService";
import { sessionService } from "@/services/sessionService";
import { toDDMMYYYY } from "@/lib/utils";
import type { TeacherItem } from "@/types/teacher";
import useSWR from "swr";

const assignSchema = z.object({
  teacherId: z.string().min(1, "Teacher is required"),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().min(1, "Section is required"),
  subjectId: z.string().min(1, "Subject is required"),
  sessionId: z.string().min(1, "Session is required"),
  fromDate: z.date(),
});

type AssignForm = z.infer<typeof assignSchema>;

export function AssignDialog({
  open,
  onOpenChange,
  teachers,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teachers: TeacherItem[];
  onSubmit: (data: AssignForm) => Promise<void>;
}) {
  const [selectedClass, setSelectedClass] = useState<string>("");

  const { data: classes = [] } = useSWR("/classes", classService.list);
  const { data: sessions = [] } = useSWR("/sessions", sessionService.list);
  const { data: subjects = [] } = useSWR("/subjects", subjectService.list);

  const { data: sections = [] } = useSWR(
    selectedClass ? `/sections/${selectedClass}` : null,
    () => sectionService.list(selectedClass),
    { revalidateOnFocus: false },
  );

  const form = useForm<AssignForm>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      teacherId: "",
      classId: "",
      sectionId: "",
      subjectId: "",
      sessionId: "",
      fromDate: new Date(),
    },
  });

  useEffect(() => {
    form.setValue("sectionId", "");
    form.setValue("subjectId", "");
  }, [selectedClass, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle>Assign Class to Teacher</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Teacher</Label>
            <Select
              value={form.watch("teacherId")}
              onValueChange={(v) => form.setValue("teacherId", v)}
            >
              <SelectTrigger className="rounded-full mt-1">
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.firstName} {t.lastName} — {t.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Class</Label>
            <Select
              value={form.watch("classId")}
              onValueChange={(v) => {
                form.setValue("classId", v);
                setSelectedClass(v);
              }}
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
            <Label>Section</Label>
            <Select
              value={form.watch("sectionId")}
              onValueChange={(v) => form.setValue("sectionId", v)}
              disabled={!selectedClass}
            >
              <SelectTrigger className="rounded-full mt-1">
                <SelectValue
                  placeholder={
                    selectedClass ? "Select section" : "Select class first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sections.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Subject</Label>
            <Select
              value={form.watch("subjectId")}
              onValueChange={(v) => form.setValue("subjectId", v)}
            >
              <SelectTrigger className="rounded-full mt-1">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Session</Label>
            <Select
              value={form.watch("sessionId")}
              onValueChange={(v) => form.setValue("sessionId", v)}
            >
              <SelectTrigger className="rounded-full mt-1">
                <SelectValue placeholder="Select session" />
              </SelectTrigger>
              <SelectContent>
                {sessions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>From Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full rounded-full mt-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("fromDate")
                    ? format(form.watch("fromDate"), "PPP")
                    : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch("fromDate")}
                  onSelect={(date) => date && form.setValue("fromDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-chart-1 to-chart-2 rounded-full"
          >
            Assign
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
