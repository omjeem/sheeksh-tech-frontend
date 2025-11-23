"use client";

import { useMemo } from "react";
import { useSWR } from "@/hooks/useSWR";
import { classService } from "@/services/classService";
import { studentService } from "@/services/studentService";
import { teacherService } from "@/services/teacherService";
import { subjectService } from "@/services/subjectService";
import { sessionService } from "@/services/sessionService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { ClassDto, StudentDto } from "@/types";

export default function DashboardPage() {
  const { data: classes, error: classesError } = useSWR("/class", () =>
    classService.list(),
  );
  const { data: students, error: studentsError } = useSWR("/student", () =>
    studentService.list(),
  );
  const { data: teachersData, error: teachersError } = useSWR("/teacher", () =>
    teacherService.list(),
  );
  const { data: subjects, error: subjectsError } = useSWR("/subject", () =>
    subjectService.list(),
  );
  const { data: sessions, error: sessionsError } = useSWR(
    "/session/active",
    () => sessionService.list(),
  );

  const teachers = teachersData?.teachers ?? [];

  const loading = !(classes && students && teachers && subjects && sessions);
  const hasError =
    classesError ||
    studentsError ||
    teachersError ||
    subjectsError ||
    sessionsError;

  // Chart data: students per class (group by classId/name)
  const studentsPerClass = useMemo(() => {
    if (!students || !classes) return [];
    // Build map classId -> name
    const nameById = new Map(
      (classes ?? []).map((c: ClassDto) => [c.id, c.name]),
    );
    // Count students by classId
    const counts = (students ?? []).reduce(
      (acc: Record<string, number>, s: StudentDto) => {
        const cid = s.classId ?? "unassigned";
        acc[cid] = (acc[cid] || 0) + 1;
        return acc;
      },
      {},
    );
    return Object.entries(counts)
      .map(([classId, count]) => ({
        classId,
        name: nameById.get(classId) ?? "Unassigned",
        count,
      }))
      .sort((a, b) => b.count - a.count);
  }, [students, classes]);

  // Chart data: teacher designation distribution
  const teacherDesignationData = useMemo(() => {
    if (!teachers) return [];
    const tally: Record<string, number> = {};
    for (const t of teachers) {
      const d = t.designation ?? "Unknown";
      tally[d] = (tally[d] || 0) + 1;
    }
    return Object.entries(tally).map(([key, value]) => ({ name: key, value }));
  }, [teachers]);

  // Recent activity: recent teachers & students (simple)
  const recentTeachers = (teachers ?? []).slice(0, 5);
  const recentStudents = (students ?? []).slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Overview — quick metrics and recent activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            className="rounded-full"
            onClick={() => window.location.assign("/dashboard/classes")}
          >
            <Plus className="w-4 h-4 mr-2" /> New Class
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => window.location.assign("/dashboard/teachers")}
          >
            Manage Teachers
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-4 col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Recent Students</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.assign("/students")}
            >
              View all
            </Button>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-6">
              Loading…
            </div>
          ) : recentStudents.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              No students yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Section</TableHead>
                  {/*<TableHead>Created</TableHead>*/}
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentStudents.map((s: StudentDto) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.classId ?? "—"}</TableCell>
                    <TableCell>{s.sectionId ?? "—"}</TableCell>
                    {/*<TableCell>
                      {s.createdAt ? format(new Date(s.createdAt), "PPP") : "—"}
                    </TableCell>*/}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-medium">Recent Teachers</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.assign("/teachers")}
            >
              Manage
            </Button>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground py-6">
              Loading…
            </div>
          ) : recentTeachers.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              No teachers
            </div>
          ) : (
            <ul className="space-y-2">
              {recentTeachers.map((t: any) => (
                <li key={t.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {t.firstName} {t.lastName ?? ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.email}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.startDate
                      ? format(new Date(t.startDate), "MMM dd, yyyy")
                      : "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Errors */}
      {hasError && (
        <div className="text-sm text-destructive">
          Failed to load some data — refresh or check your API.
        </div>
      )}
    </div>
  );
}
