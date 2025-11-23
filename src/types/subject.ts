import { z } from "zod";
import { SubjectDto } from ".";

export type SubjectItem = SubjectDto;

export const subjectSchema = z.object({
  name: z.string().min(1, "Name required"),
  code: z.string().optional(),
});

export type SubjectForm = z.infer<typeof subjectSchema>;
