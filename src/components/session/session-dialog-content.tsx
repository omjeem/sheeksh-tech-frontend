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

  console.log("isEditing", isEditing);

  useEffect(() => {
    if (startDate) {
      const tmpStartDate = new Date(startDate);
      const year = tmpStartDate.getFullYear();
      const month = tmpStartDate.getMonth();
      const day = tmpStartDate.getDate();
      const sessionName = `${year}-${year + 1}`;
      const endDate = new Date(year + 1, month, day); // Dec 31 of next year

      form.setValue("name", sessionName);
      form.setValue("endDate", endDate.toDateString());
    }
  }, [startDate, form]);

  return (
    <>
      <div>
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger disabled={isEditing} asChild>
            <Button
              variant="outline"
              className="w-full rounded-full mt-1 justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
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
        <Label>Session Name</Label>
        <Input
          value={form.watch("name")}
          disabled
          className="rounded-full mt-1 bg-muted"
        />
      </div>

      <div>
        <Label>End Date</Label>
        <Input
          value={startDate ? format(form.watch("endDate"), "PPP") : ""}
          disabled
          className="rounded-full mt-1 bg-muted"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={isActive}
          onCheckedChange={(checked) => form.setValue("isActive", checked)}
        />
        <Label>Active Session</Label>
      </div>
    </>
  );
}
