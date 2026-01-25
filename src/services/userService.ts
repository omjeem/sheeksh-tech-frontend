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

  search: async (
    payload: {
      type: "TEACHER" | "STUDENT" | "USER";
      searchQuery?: string;
      classId?: string;
      sectionId?: string;
      role?: "GUARDIAN";
    },
    page = 1,
  ) => {
    const res = await api.put(
      `/user/search?pageNo=${page}&pageSize=10`,
      payload,
    );
    return res; // Should return { users: UserSearchResult[], total: number }
  },
};
