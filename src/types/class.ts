import { z } from "zod";
import { ClassDto } from ".";

export type ClassItem = ClassDto;

export const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  description: z.string().optional(),
});

export type ClassForm = z.infer<typeof classSchema>;
