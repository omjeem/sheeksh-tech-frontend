import type { SectionDto, SectionCreateDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";
import { api } from "@/lib/api";

export const sectionService = {
  ...createCRUDService<SectionDto, SectionCreateDto>("/section"),
  list: (classId?: string): Promise<SectionDto[]> =>
    api.get<SectionDto[]>(classId ? `/section/${classId}` : "/section"),
};
