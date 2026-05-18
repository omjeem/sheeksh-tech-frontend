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
import { PasswordInput } from "../ui/password-input";

const ErrorMessage = ({ message }: { message?: string }) =>
  message ? (
    <p className="text-[12px] font-medium text-danger-ink mt-1.5">{message}</p>
  ) : null;

export function StudentDialogContent({
  form,
  sections,
}: {
  form: UseFormReturn<StudentForm>;
  sections: SectionItem[];
}) {
  const { data: sessions = [] } = useSWR("sessions", sessionService.list);
  const {
    formState: { errors },
  } = form;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Label>Section</Label>
        <Select
          value={form.watch("sectionId")}
          onValueChange={(v) =>
            form.setValue("sectionId", v, { shouldValidate: true })
          }
        >
          <SelectTrigger>
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
        <ErrorMessage message={errors.sectionId?.message} />
      </div>

      <div>
        <Label>Session</Label>
        <Select
          value={form.watch("sessionId")}
          onValueChange={(v) =>
            form.setValue("sessionId", v, { shouldValidate: true })
          }
        >
          <SelectTrigger>
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
        <ErrorMessage message={errors.sessionId?.message} />
      </div>

      <div>
        <Label>First name</Label>
        <Input {...form.register("firstName")} placeholder="John" />
        <ErrorMessage message={errors.firstName?.message} />
      </div>

      <div>
        <Label>Last name</Label>
        <Input {...form.register("lastName")} placeholder="Doe" />
        <ErrorMessage message={errors.lastName?.message} />
      </div>

      <div className="sm:col-span-2">
        <Label>Email</Label>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="john@example.com"
        />
        <ErrorMessage message={errors.email?.message} />
      </div>

      <div>
        <Label>Password</Label>
        <PasswordInput {...form.register("password")} />
        <ErrorMessage message={errors.password?.message} />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          {...form.register("phone")}
          type="tel"
          placeholder="+91 98765 43210"
        />
        <ErrorMessage message={errors.phone?.message} />
      </div>

      <div>
        <Label>Date of birth</Label>
        <Input {...form.register("dateOfBirth")} type="date" />
        <ErrorMessage message={errors.dateOfBirth?.message} />
      </div>
    </div>
  );
}
