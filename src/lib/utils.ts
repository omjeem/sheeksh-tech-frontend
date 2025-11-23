import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export const formatDate = (
  date: Date | string | null | undefined,
  dateFormat: string = "PPP",
): string => {
  if (!date) {
    return "—";
  }
  try {
    return format(new Date(date), dateFormat);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toDDMMYYYY = (d: Date) => {
  return format(d, "dd-MM-yyyy");
}; // keeps same formatting as backend

// utils/jwt.ts or just inline
export function decodeJWT(token: string) {
  try {
    const payload = token.split(".")[1];
    // Handle URL-safe base64
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid JWT token", error);
    return null;
  }
}
