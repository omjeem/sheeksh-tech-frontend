import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import EmptyState from "@/components/common/empty-state";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  align?: "left" | "right" | "center";
};

type DataTableProps<T extends { id: string }> = {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  wrap?: boolean;
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  emptyTitle = "No items found",
  emptyDescription = "Records will appear here when they're added.",
  wrap = true,
}: DataTableProps<T>) {
  const content = (() => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-5 animate-spin text-ink-3" />
        </div>
      );
    }
    if (!data || data.length === 0) {
      return (
        <EmptyState
          icon={Inbox}
          title={emptyTitle}
          description={emptyDescription}
        />
      );
    }
    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.header}
                className={cn(
                  col.align === "right" && "text-right",
                  col.align === "center" && "text-center",
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
            {(onEdit || onDelete) && (
              <TableHead className="text-right w-[1%]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              {columns.map((col) => (
                <TableCell
                  key={col.header}
                  className={cn(
                    col.align === "right" && "text-right tnum",
                    col.align === "center" && "text-center",
                    col.className,
                  )}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(item)
                    : (item[col.accessor] as React.ReactNode)}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell className="text-right whitespace-nowrap w-[1%]">
                  <div className="flex justify-end gap-1">
                    {onEdit && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => onEdit(item)}
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        className="text-danger-ink hover:bg-danger-soft"
                        onClick={() => onDelete(item.id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  })();

  if (!wrap) return content;
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {content}
    </div>
  );
}
