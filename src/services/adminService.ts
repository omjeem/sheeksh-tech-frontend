// services/systemAdminService.ts
import { api } from "@/lib/api";

export const SYSTEM_ADMIN_ACCESS = [
  "SUPER_ROOT",
  "ROOT",
  "MAINTAINER",
  "VIEWER",
] as const;
export const PLAN_TYPES = ["PUBLIC", "CUSTOM"] as const;
export const CHANNELS = ["EMAIL", "SMS"] as const;
export const USAGE_LIMITS = [
  "DAILY",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
  "ONE_TIME",
] as const;

export const adminService = {
  // Profile & Admins
  getProfile: () => api.get("/user"),
  updatePassword: (password: string) => api.put("/admin/profile", { password }),
  createAdmin: (data: any) => api.post("/admin/user", data),
  getAdmins: () => api.get("/user"),
  // School Management
  getSchools: () => api.get("/admin/school"),

  // Notification Plans
  getNotificationPlans: () => api.get("/admin/notification/plan"),
  createNotificationPlan: (data: any) =>
    api.post("/admin/notification/plan", data),
  purchasePlanForSchool: (data: {
    schoolId: string;
    planId: string;
    price?: number;
  }) => api.post("/admin/notification/plan/purchase", data), // Inferred endpoint

  // Limits & Ledger
  getLedger: (page = 1, pageSize = 10) =>
    api.get(`/admin/notification/ledger?pageNo=${page}&pageSize=${pageSize}`),
  setUsageLimit: (data: {
    schoolId?: string;
    channel: string;
    frequency: string;
    limit: number;
  }) => api.post("/admin/notification/limit", data),
};
