import { z } from "zod";
import { SectionDto } from ".";

export type SectionItem = SectionDto;

export const sectionSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  name: z.string().min(1, "Section name is required"),
});

export type SectionForm = z.infer<typeof sectionSchema>;
