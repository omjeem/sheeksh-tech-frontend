import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { GraduationCap, Pencil, Trash2, Users } from "lucide-react";
import type { StudentItem } from "@/types/student";
import InitialsAvatar from "@/components/common/initials-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/empty-state";

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
  if (isLoading) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }
  if (students.length === 0) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="No students yet"
        description="Add students individually or via bulk upload to start tracking attendance and academics."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60px]">Sr No</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((s) => {
          const fullName = `${s.firstName} ${s.lastName ?? ""}`.trim();
          return (
            <TableRow key={s.id}>
              <TableCell className="tnum text-ink-3">
                {s.srNo ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <InitialsAvatar name={fullName} size="md" />
                  <div>
                    <div className="font-medium text-ink">{fullName}</div>
                    <div className="text-[12px] text-ink-3 mono">
                      ID · {s.id?.slice(0, 8) ?? "—"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-ink-3 max-w-xs truncate">
                {s.email ?? "—"}
              </TableCell>
              <TableCell className="text-ink-3">
                {(s as any).phone ?? "—"}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap w-[1%]">
                <div className="flex justify-end gap-1">
                  {onManageGuardians && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onManageGuardians(s)}
                      aria-label="Manage guardians"
                    >
                      <Users size={14} />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      onClick={() => onEdit(s)}
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
                      onClick={() => onDelete(s.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
