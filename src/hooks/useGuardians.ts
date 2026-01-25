import { useCRUD } from "./useCRUD";
import { classService } from "@/services/classService";
import type { ClassItem } from "@/types/class";

export const useGuardians = () => {
  return useCRUD({
    key: "/user/guardian",
    listFn: classService.list,
    createFn: classService.create,
    updateFn: classService.update,
    deleteFn: classService.remove,
    resourceName: "Class",
  });
};
