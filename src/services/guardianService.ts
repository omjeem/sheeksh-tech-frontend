import type { StudentDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";
import { api } from "@/lib/api";

export const GUARDIANS_RELATIONS = [
  "FATHER",
  "MOTHER",
  "BROTHER",
  "SISTER",
  "GRAND_FATHER",
  "GRAND_MOTHER",
  "UNCLE",
  "AUNTY",
] as const;

export const guardianService = {
  createGuardian: (data: any[]) => api.post("/user/guardian", data),

  mapGuardian: (payload: {
    childUserId: string;
    guardians: Array<{ guardianUserId: string; relation: any }>;
  }) => api.post("/user/guardian-map", payload),

  getGuardianChildren: (userId: string) =>
    api.get<any>(`/user/guardian-children/${userId}`),
};
