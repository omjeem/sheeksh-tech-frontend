import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { TeacherForm } from "@/types/teacher";
import { PasswordInput } from "../ui/password-input";

export function TeacherDialogContent({
  form,
  editing,
}: {
  form: UseFormReturn<TeacherForm>;
  editing: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input
            {...form.register("firstName")}
            className="rounded-full mt-1"
          />
          {form.formState.errors.firstName && (
            <p className="text-destructive text-xs mt-1">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Label>Last Name (Optional)</Label>
          <Input {...form.register("lastName")} className="rounded-full mt-1" />
        </div>
      </div>

      <div>
        <Label>Email</Label>
        <Input
          type="email"
          {...form.register("email")}
          className="rounded-full mt-1"
        />
        {form.formState.errors.email && (
          <p className="text-destructive text-xs mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label>Password {editing && "(Leave blank to keep current)"}</Label>
        <PasswordInput
          {...form.register("password")}
          className="rounded-full mt-1 pr-10"
          placeholder={editing ? "Leave blank" : "Enter password"}
        />
        {form.formState.errors.password && (
          <p className="text-destructive text-xs mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label>Designation</Label>
        <Select
          value={form.watch("designation")}
          onValueChange={(v) =>
            form.setValue("designation", v as "TGT" | "PGT")
          }
        >
          <SelectTrigger className="rounded-full mt-1">
            <SelectValue placeholder="Select designation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TGT">TGT</SelectItem>
            <SelectItem value="PGT">PGT</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.designation && (
          <p className="text-destructive text-xs mt-1">
            {form.formState.errors.designation.message}
          </p>
        )}
      </div>

      <div>
        <Label>Date of Birth</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full rounded-full mt-1 justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.watch("dateOfBirth")
                ? format(form.watch("dateOfBirth"), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.watch("dateOfBirth")}
              onSelect={(date) => date && form.setValue("dateOfBirth", date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-full mt-1 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("startDate")
                  ? format(form.watch("startDate"), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("startDate")}
                onSelect={(date) => date && form.setValue("startDate", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label>End Date (Optional)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full rounded-full mt-1 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {form.watch("endDate")
                  ? format(form.watch("endDate"), "PPP")
                  : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={form.watch("endDate")}
                onSelect={(date) => form.setValue("endDate", date || undefined)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
