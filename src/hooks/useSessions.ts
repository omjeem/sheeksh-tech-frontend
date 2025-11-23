import { useCRUD } from "./useCRUD";
import { sessionService } from "@/services/sessionService";
import type { SessionItem } from "@/types/session";

export const useSessions = () =>
  useCRUD<SessionItem, { name: string; startDate: string; endDate: string }>({
    key: "/sessions",
    listFn: sessionService.list,
    createFn: sessionService.create,
    updateFn: sessionService.update,
    deleteFn: sessionService.remove,
  });
