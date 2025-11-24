import { sectionService } from "@/services/sectionService";
import type { SectionItem } from "@/types/section";
import { useCRUD } from "./useCRUD";
import type { SectionForm } from "@/types/section";

export const useSections = (classId: string | null) => {
  return useCRUD<SectionItem, SectionForm, Partial<SectionItem>>({
    key: `/sections/${classId}`,
    listFn: () => sectionService.list(classId ?? undefined),
    createFn: sectionService.create,
    updateFn: sectionService.update,
    deleteFn: sectionService.remove,
    resourceName: "Section",
  });
};
