import { api } from "@/lib/api";

export const createCRUDService = <
  T,
  CreateDTO = Partial<T>,
  UpdateDTO = Partial<T>,
>(
  basePath: string,
) => ({
  list: (params?: Record<string, string>): Promise<T[]> => {
    const qp = params ? `?${new URLSearchParams(params)}` : "";
    return api.get<T[]>(`${basePath}${qp}`);
  },
  get: (id: string): Promise<T> => api.get<T>(`${basePath}/${id}`),
  create: (data: CreateDTO): Promise<T> => api.post<T>(basePath, data),
  update: (id: string, data: UpdateDTO): Promise<T> =>
    api.put<T>(`${basePath}/${id}`, data),
  remove: (id: string): Promise<void> => api.del<void>(`${basePath}/${id}`),
});
