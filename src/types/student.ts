import { z } from "zod";
import { StudentDto } from ".";

export type StudentItem = StudentDto;

export const studentSchema = z.object({
  sectionId: z.string().min(1, "Section is required"),
  sessionId: z.string().min(1, "Session is required"),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  password: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  dateOfBirth: z.string().optional(),
});

export type StudentForm = z.infer<typeof studentSchema>;

export type ParsedStudent = {
  firstName: string;
  lastName?: string;
  email?: string;
  password?: string;
  dateOfBirth?: string; // DD/MM/YYYY
};
