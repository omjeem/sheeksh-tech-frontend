import { z } from "zod";
import { TeacherDto } from ".";

export type TeacherItem = TeacherDto;

export const teacherSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().optional(),
  designation: z.string("Designation required"),
  // z.enum(["TGT", "PGT"], {
  //   required_error: "Designation required",
  // }),
  dateOfBirth: z.string().min(1, "Date of birth required"), // dd-MM-yyyy
  startDate: z.string().min(1, "Start date required"), // dd-MM-yyyy
  endDate: z.string().optional(),
});

export type TeacherForm = z.infer<typeof teacherSchema>;
