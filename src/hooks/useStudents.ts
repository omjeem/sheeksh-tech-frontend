import { studentService } from "@/services/studentService";
import type { StudentItem } from "@/types/student";
import useSWR from "swr";

export const useStudents = (
  classId: string | null,
  sectionId: string | null,
) => {
  const key = classId && sectionId ? `/students/${classId}/${sectionId}` : null;
  const {
    data: students = [],
    isLoading,
    mutate,
  } = useSWR<StudentItem[]>(
    key,
    () =>
      sectionId
        ? studentService.list({ classId: classId!, sectionId })
        : Promise.resolve([]),
    { revalidateOnFocus: false },
  );
  return { students, isLoading, mutate };
};
