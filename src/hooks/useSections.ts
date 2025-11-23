import { sectionService } from "@/services/sectionService";
import type { SectionItem } from "@/types/section";
import useSWR from "swr";

export const useSections = (classId: string | null) => {
  const { data: sections = [], isLoading } = useSWR<SectionItem[]>(
    classId ? `/sections/${classId}` : null,
    () => (classId ? sectionService.list(classId) : Promise.resolve([])),
    { revalidateOnFocus: false },
  );

  return { sections, isLoading };
};
