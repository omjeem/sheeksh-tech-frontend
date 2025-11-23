import { useCRUD } from "./useCRUD";
import { subjectService } from "@/services/subjectService";
import type { SubjectForm, SubjectItem } from "@/types/subject";

export const useSubjects = () =>
  useCRUD<SubjectItem, SubjectForm>({
    key: "subjects",
    listFn: subjectService.list,
    createFn: subjectService.create,
    updateFn: subjectService.update,
    deleteFn: subjectService.remove,
  });
