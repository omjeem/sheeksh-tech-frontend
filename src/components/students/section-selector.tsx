import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClassItem } from "@/types/class";
import type { SectionItem } from "@/types/section";

export function SectionSelector({
  selectedClass,
  classes,
  sections,
  selectedSection,
  onSelectClass,
  onSelectSection,
}: {
  selectedClass: string | null;
  classes: ClassItem[];
  sections: SectionItem[];
  selectedSection: string | null;
  onSelectClass: (id: string) => void;
  onSelectSection: (id: string) => void;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg border">
      <div className="flex-1">
        <Label>Class</Label>
        <Select value={selectedClass || ""} onValueChange={onSelectClass}>
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
      <div className="flex-1">
        <Label>Section</Label>
        <Select
          value={selectedSection || ""}
          onValueChange={onSelectSection}
          disabled={!selectedClass}
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
    </div>
  );
}
