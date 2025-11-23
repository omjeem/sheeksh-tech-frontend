import type { SubjectDto, SubjectCreateDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";
import { api } from "@/lib/api";

const baseService = createCRUDService<SubjectDto, SubjectCreateDto>("/subject");

export const subjectService = {
  ...baseService,
  list: () =>
    api
      .get<
        {
          id: string;
          subject: string;
        }[]
      >("/subject")
      .then((d) => d.map((s) => ({ ...s, name: s.subject }))),
};
