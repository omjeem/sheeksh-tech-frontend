import type { SessionDto, SessionCreateDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";

export const sessionService = createCRUDService<SessionDto, SessionCreateDto>(
  "/session",
);
