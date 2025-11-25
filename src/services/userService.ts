import { api } from "@/lib/api";

export const userService = {
  getProfile: () =>
    api.get<{
      id: string;
      role: string | "SUPER_ADMIN";
      email: string;
      phone: string;
      dateOfBirth: string;
      firstName: string;
      lastName: string;
      createdAt: string;
    }>("/user"),
};
