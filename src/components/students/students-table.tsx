import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Users } from "lucide-react";
import type { StudentItem } from "@/types/student";

export function StudentsTable({
  students,
  isLoading,
  onEdit,
  onDelete,
  onManageGuardians,
}: {
  students: StudentItem[];
  isLoading: boolean;
  onEdit?: (s: StudentItem) => void;
  onDelete?: (id: string) => void;
  onManageGuardians?: (s: StudentItem) => void;
}) {
  if (isLoading)
    return (
      <p className="p-8 text-center text-muted-foreground">
        Loading students...
      </p>
    );
  if (students.length === 0)
    return (
      <p className="p-8 text-center text-muted-foreground">
        No students found.
      </p>
    );

  return (
    <div className="flex-1 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            {/*<TableHead>DOB</TableHead>
            <TableHead>Created</TableHead>*/}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.srNo ?? "-"}</TableCell>
              <TableCell className="font-medium">
                {s.firstName} {s.lastName}
              </TableCell>
              <TableCell className="max-w-xs truncate">
                {s.email ?? "-"}
              </TableCell>
              {/*<TableCell>
                {s.dateOfBirth
                  ? new Date(s.dateOfBirth).toLocaleDateString()
                  : "-"}
              </TableCell>
              <TableCell>
                {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "-"}
              </TableCell>*/}
              <TableCell className="text-right">
                {onEdit && (
                  <Button size="icon" variant="ghost" onClick={() => onEdit(s)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => onDelete(s.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                {onManageGuardians && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => onManageGuardians(s)}
                    title="Manage Guardians"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
