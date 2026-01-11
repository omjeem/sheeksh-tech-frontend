import { Card, CardContent } from "@/components/ui/card";
import { notificationService } from "@/services/notificationService";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";

interface VariablesBarProps {
  onDragStart: (e: React.DragEvent, variable: string) => void;
  onInsertVariable: (variable: string) => void;
}

export default function VariablesBar({
  onDragStart,
  onInsertVariable,
}: VariablesBarProps) {
  const [variables, setVariables] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await notificationService.variables.list();
        setVariables(res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <Card>
      {/*<CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Dynamic Variables
        </CardTitle>
        <CardDescription>
          Drag chips into the editor to personalize.
        </CardDescription>
      </CardHeader>
      <Separator />*/}
      <CardContent className="space-y-6">
        <div className="flex md:flex-col gap-2">
          {variables?.map((variable, i) => (
            <div
              key={i}
              draggable
              onDragStart={(e) => onDragStart(e, variable)}
              onClick={() => onInsertVariable(variable)}
              className="group flex items-center justify-between p-2 rounded-md border border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-grab active:cursor-grabbing transition-all"
            >
              <div className="flex items-center gap-3">
                <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground" />
                <span className="text-sm font-medium">{variable}</span>
              </div>
            </div>
          ))}
        </div>

        {/*<div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="text-sm text-blue-900 dark:text-blue-200">
              <p className="font-semibold mb-1">Tip:</p>
              The system will automatically replace these chips with the
              recipient&apos;s actual data when sent.
            </div>
          </div>
        </div>*/}
      </CardContent>
    </Card>
  );
}
