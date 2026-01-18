import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Template } from "@/types/notification";
import { Calendar, FileEdit, MoreVertical, Tag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents navigating to draft page
    router.push(`/dashboard/templates/edit/${template.id}`);
  };

  return (
    <Card
      onClick={() =>
        router.push(`/dashboard/notifications/draft/${template?.id}`)
      }
      className="group hover:border-primary/50 transition-all hover:shadow-md cursor-pointer overflow-hidden flex flex-col h-full"
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <Badge variant="secondary">
            <Tag className="mr-1 h-3 w-3" /> {template.category.category}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <FileEdit className="mr-2 h-4 w-4" /> Edit Template
              </DropdownMenuItem>
              {/*<DropdownMenuItem className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>*/}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors mt-2">
          {template.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground italic line-clamp-2">
          {template.templatePayload.subject}
        </p>
      </CardContent>

      <CardFooter className="pt-3 border-t bg-muted/5 flex justify-between items-center text-[10px] text-muted-foreground uppercase tracking-wider">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {new Date(template.updatedAt).toLocaleDateString()}
        </div>
        <Badge variant="outline" className="text-[9px] font-normal">
          {template.templatePayload.variables.length} Variables
        </Badge>
      </CardFooter>
    </Card>
  );
}
