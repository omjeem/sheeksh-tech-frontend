import { z } from "zod";
import { SessionDto } from ".";

export type SessionItem = SessionDto;

export const sessionSchema = z.object({
  name: z.string().min(1, "Name required"),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  isActive: z.boolean(),
});

export type SessionForm = z.infer<typeof sessionSchema>;
