// types.ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  url: z
    .string()
    .min(4, "Website URL too short")
    .refine(
      (val) => {
        try {
          new URL(val.startsWith("http") ? val : `https://${val}`);
          return true;
        } catch {
          return false;
        }
      },
      { message: "Please enter a valid website URL (e.g. paradise.edu.in)" },
    ),
  address: z.string().min(10, "Enter full address"),
  phone: z.string().regex(/^\d{10,15}$/, "Valid 10-15 digit phone"),
  superAdminName: z.string().min(2),
  superAdminEmail: z.string().email(),
  superAdminPhone: z.string().regex(/^\d{10,15}$/),
  superAdminPassword: z
    .string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Needs upper, lower, number"),
  meta: z.string().nullable().optional(),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
