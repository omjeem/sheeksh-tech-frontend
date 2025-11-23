import { z } from "zod";

const zodDateValidator = z.string().optional().or(z.date().optional());

export const registerSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  url: z.string().min(1, "Website URL is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  address: z.string().min(5, "Full address required"),
  admin: z.object({
    firstName: z.string().min(2, "First name required"),
    lastName: z.string().optional(),
    email: z.string().email("Invalid admin email"),
    phone: z.string().min(10, "Valid phone required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    dateOfBirth: zodDateValidator,
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
