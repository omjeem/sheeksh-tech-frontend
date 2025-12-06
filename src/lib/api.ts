import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { extractErrorMessage } from "./helpers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8078";

async function request<T>(
  path: string,
  opts: AxiosRequestConfig = {},
): Promise<T> {
  const token = localStorage.getItem("authToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((opts.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const response = await axios({
      url: `${API_BASE}${path}`,
      ...opts,
      headers,
    });
    return response.data.data as T;
  } catch (error: any) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/auth/school";
    }

    const message = extractErrorMessage(
      error,
      `HTTP ${error.response?.status}`,
    );
    throw new Error(message);
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: any) =>
    request<T>(path, { method: "POST", data: body }),
  put: <T>(path: string, body?: any) =>
    request<T>(path, { method: "PUT", data: body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
