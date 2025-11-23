import type { ClassDto, ClassCreateDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";

export const classService = createCRUDService<ClassDto, ClassCreateDto>(
  "/class",
);
