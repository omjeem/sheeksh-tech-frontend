import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import type { UseFormReturn } from "react-hook-form";
import type { SessionForm } from "@/types/session";
import { Button } from "../ui/button";
import { useEffect } from "react";

export function SessionDialogContent({
  form,
  isEditing,
}: {
  form: UseFormReturn<SessionForm>;
  isEditing: boolean;
}) {
  const startDate = form.watch("startDate");
  const isActive = form.watch("isActive");

  useEffect(() => {
    if (startDate) {
      const tmpStartDate = new Date(startDate);
      const year = tmpStartDate.getFullYear();
      const month = tmpStartDate.getMonth();
      const day = tmpStartDate.getDate();
      const sessionName = `${year}-${year + 1}`;
      const endDate = new Date(year + 1, month, day);

      form.setValue("name", sessionName);
      form.setValue("endDate", endDate.toDateString());
    }
  }, [startDate, form]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Label>Start date</Label>
        <Popover>
          <PopoverTrigger disabled={isEditing} asChild>
            <Button
              variant="secondary"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon size={14} />
              {startDate ? format(startDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={new Date(startDate)}
              onSelect={(date) =>
                form.setValue("startDate", date!.toDateString())
              }
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label>Session name</Label>
        <Input value={form.watch("name")} disabled />
      </div>

      <div>
        <Label>End date</Label>
        <Input
          value={startDate ? format(form.watch("endDate"), "PPP") : ""}
          disabled
        />
      </div>

      <div className="flex items-center justify-between p-3 rounded-md bg-surface-2 border border-border">
        <div>
          <Label className="mb-0.5">Active session</Label>
          <p className="text-[12px] text-ink-3">
            New enrollments default to this session.
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
      </div>
    </div>
  );
}
