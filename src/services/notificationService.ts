import { api } from "@/lib/api";
import { Category, Template } from "@/types/notification";

// --- Types based on your payload requirements ---

export type ChannelType = "EMAIL" | "SMS";

export interface RecipientFilter {
  sentAll: boolean;
  isInclude: boolean;
  values: string[]; // UUIDs
}

export interface SectionFilter extends RecipientFilter {
  id: string; // Section ID
}

export interface DraftPayload {
  channels: ChannelType[];
  // Priority 1: Specific Users
  users?: RecipientFilter;
  // Priority 2: Groups (if users is undefined)
  teachers?: RecipientFilter;
  students?: RecipientFilter;
  sections?: SectionFilter[];
}

export interface UserSearchPayload {
  role?: "STUDENT" | "TEACHER" | "ADMIN";
  searchTerm?: string;
  classId?: string;
  sectionId?: string;
}

export interface UserSearchResult {
  id: string;
  name: string;
  email: string;
  role: string;
}

// --- Service Implementation ---

const categories = {
  create: (category: string) =>
    api.post("/notification/category", { categories: [category] }),
  list: () => api.get<Category[]>("/notification/category"),
};

const variables = {
  list: () => api.get<string[]>("/notification/variables"),
};

const templates = {
  list: () => api.get<Template[]>("/notification/template"),
  get: (id: string) => api.get<Template>(`/notification/template/${id}`), // Added get one
  create: (payload: any) => api.post("/notification/template", payload),
};

const drafts = {
  // 1. Create Draft
  create: (templateId: string, payload: DraftPayload) =>
    api.post<{ id: string }>(`/notification/draft/${templateId}`, payload), // Returns Draft UUID

  // 2. Send Draft
  send: (draftId: string) =>
    api.post(`/notification/send/draft/${draftId}`, {}),
};

const users = {
  // Helper to find recipients
  search: (payload: UserSearchPayload, page = 1, pageSize = 20) =>
    api.put<{ data: UserSearchResult[]; total: number }>(
      `/user/search?pageNo=${page}&pageSize=${pageSize}`,
      payload,
    ),
};

export const notificationService = {
  categories,
  variables,
  templates,
  drafts,
  users,
};
