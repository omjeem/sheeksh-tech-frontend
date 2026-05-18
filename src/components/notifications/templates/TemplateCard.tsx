import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Template } from "@/types/notification";
import {
  ArrowRight,
  Calendar,
  FileEdit,
  MoreHorizontal,
  Send,
  Tag as TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

const toneByCategory: Record<
  string,
  "brand" | "teal" | "warning" | "info" | "success" | "danger"
> = {
  Fees: "warning",
  Welcome: "brand",
  Attendance: "danger",
  Events: "teal",
  Exams: "info",
  Transport: "danger",
};

export default function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/templates/edit/${template.id}`);
  };

  const tone =
    toneByCategory[template.category.category as keyof typeof toneByCategory] ??
    "brand";

  return (
    <div
      onClick={() =>
        router.push(`/dashboard/notifications/draft/${template?.id}`)
      }
      className="group bg-surface border border-border rounded-xl flex flex-col cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between">
          <Badge variant={tone}>
            <TagIcon size={11} /> {template.category.category}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon-sm" className="-mr-1">
                <MoreHorizontal size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <FileEdit size={14} /> Edit template
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h3 className="text-[17px] font-semibold mt-3 tracking-tight text-ink group-hover:text-brand transition-colors line-clamp-1">
          {template.name}
        </h3>
        <p className="text-[13px] text-ink-2 mt-2 leading-[1.5] line-clamp-3 min-h-[60px]">
          {template.templatePayload.subject}
        </p>
      </div>
      <div className="border-t border-divider px-5 py-3 bg-bg-2 flex items-center justify-between text-[11px] text-ink-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <TagIcon size={11} />{" "}
            {template.templatePayload.variables.length} vars
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} />
            {new Date(template.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-brand font-medium text-[12px]">
          Use <ArrowRight size={12} />
        </span>
      </div>
    </div>
  );
}
