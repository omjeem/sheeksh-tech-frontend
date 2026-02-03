// types/admin.ts
export type AdminAccess = "SUPER_ROOT" | "ROOT" | "MAINTAINER" | "VIEWER";

export interface SystemAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  access: AdminAccess;
  createdAt: string;
}

// Utility for UX: Mapping access levels to colors
export const ACCESS_COLORS: Record<AdminAccess, string> = {
  SUPER_ROOT: "bg-red-500/10 text-red-500 border-red-500/20",
  ROOT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  MAINTAINER: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  VIEWER: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};
