import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";

type Column<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
};

type DataTableProps<T extends { id: string }> = {
  data: T[];
  columns: Column<T>[];
  isLoading: boolean;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
};

export function DataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-12">No items found.</p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.header}>{col.header}</TableHead>
          ))}
          {/*<TableHead className="text-right">Actions</TableHead>*/}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((col) => (
              <TableCell key={col.header}>
                {typeof col.accessor === "function"
                  ? col.accessor(item)
                  : item[col.accessor]}
              </TableCell>
            ))}
            {/*<TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>*/}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
