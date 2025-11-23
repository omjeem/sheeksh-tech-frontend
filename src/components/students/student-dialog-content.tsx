import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sessionService } from "@/services/sessionService";
import type { SectionItem } from "@/types/section";
import type { UseFormReturn } from "react-hook-form";
import type { StudentForm } from "@/types/student";
import useSWR from "swr";

export function StudentDialogContent({
  form,
  sections,
}: {
  form: UseFormReturn<StudentForm>;
  sections: SectionItem[];
}) {
  const { data: sessions = [] } = useSWR("sessions", sessionService.list);

  return (
    <>
      <div>
        <Label>Section</Label>
        <Select
          value={form.watch("sectionId")}
          onValueChange={(v) => form.setValue("sectionId", v)}
        >
          <SelectTrigger className="rounded-full mt-1">
            <SelectValue placeholder="Select section" />
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
        <Label>First Name</Label>
        <Input
          {...form.register("firstName")}
          placeholder="John"
          className="rounded-full mt-1"
        />
      </div>

      <div>
        <Label>Last Name (Optional)</Label>
        <Input
          {...form.register("lastName")}
          placeholder="Doe"
          className="rounded-full mt-1"
        />
      </div>

      <div>
        <Label>Email (Optional)</Label>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="john@example.com"
          className="rounded-full mt-1"
        />
      </div>

      {/*{!form.getValues("id") && (*/}
      <div>
        <Label>Password</Label>
        <Input
          {...form.register("password")}
          type="password"
          className="rounded-full mt-1"
        />
      </div>
      {/*)}*/}

      <div>
        <Label>Date of Birth</Label>
        <Input
          {...form.register("dateOfBirth")}
          type="date"
          className="rounded-full mt-1"
        />
      </div>
    </>
  );
}
