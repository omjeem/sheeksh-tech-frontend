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
    <p className="text-xs font-medium text-destructive mt-1 ml-1">{message}</p>
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
    <>
      <div>
        <Label>Section</Label>
        <Select
          value={form.watch("sectionId")}
          onValueChange={(v) =>
            form.setValue("sectionId", v, { shouldValidate: true })
          }
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
        <ErrorMessage message={errors.sessionId?.message} />
      </div>

      <div>
        <Label>First Name</Label>
        <Input
          {...form.register("firstName")}
          placeholder="John"
          className="rounded-full mt-1"
        />
        <ErrorMessage message={errors.firstName?.message} />
      </div>

      <div>
        <Label>Last Name</Label>
        <Input
          {...form.register("lastName")}
          placeholder="Doe"
          className="rounded-full mt-1"
        />
        <ErrorMessage message={errors.lastName?.message} />
      </div>

      <div>
        <Label>Email</Label>
        <Input
          {...form.register("email")}
          type="email"
          placeholder="john@example.com"
          className="rounded-full mt-1"
        />
        <ErrorMessage message={errors.email?.message} />
      </div>

      <div>
        <Label>Password</Label>
        <PasswordInput
          {...form.register("password")}
          className="rounded-full mt-1"
        />
        <ErrorMessage message={errors.password?.message} />
      </div>

      <div>
        <Label>Phone</Label>
        <Input
          {...form.register("phone")}
          type="tel"
          placeholder="1234567890"
          className="rounded-full mt-1"
        />
        <ErrorMessage message={errors.phone?.message} />
      </div>

      <div>
        <Label>Date of Birth</Label>
        <Input
          {...form.register("dateOfBirth")}
          type="date"
          className="rounded-full mt-1"
        />
        <ErrorMessage message={errors.dateOfBirth?.message} />
      </div>
    </>
  );
}
