import type { SubjectDto, SubjectCreateDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";

export const subjectService = createCRUDService<SubjectDto, SubjectCreateDto>(
  "/subject",
);
