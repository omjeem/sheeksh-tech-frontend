import { useCRUD } from "./useCRUD";
import { teacherService } from "@/services/teacherService";
import type { TeacherItem } from "@/types/teacher";
import type { TeacherForm } from "@/types/teacher";
import { toDDMMYYYY } from "@/lib/utils";
import { TeacherCreateDto } from "@/types";

const convertFormToDto = (formData: TeacherForm): TeacherCreateDto => {
  return {
    email: formData.email,
    password: formData.password,
    firstName: formData.firstName,
    lastName: formData.lastName || undefined,
    phone: formData.phone,
    designation: formData.designation as "TGT" | "PGT",
    dateOfBirth: formData.dateOfBirth,
    startDate: formData.startDate,
    endDate: formData.endDate ? formData.endDate : undefined,
  };
};

const convertPartialFormToDto = (
  partialData: Partial<TeacherForm>,
): Partial<TeacherCreateDto> => ({
  ...(partialData.email && { email: partialData.email }),
  ...(partialData.password && { password: partialData.password }),
  ...(partialData.firstName && { firstName: partialData.firstName }),
  ...(partialData.lastName !== undefined && {
    lastName: partialData.lastName || undefined,
  }),
  ...(partialData.designation && {
    designation: partialData.designation as "TGT" | "PGT",
  }),
  ...(partialData.dateOfBirth && {
    dateOfBirth: toDDMMYYYY(new Date(partialData.dateOfBirth)),
  }),
  ...(partialData.startDate && {
    startDate: toDDMMYYYY(new Date(partialData.startDate)),
  }),
  ...(partialData.endDate !== undefined && {
    endDate: partialData.endDate
      ? toDDMMYYYY(new Date(partialData.endDate))
      : undefined,
  }),
});

export const useTeachers = () =>
  useCRUD<TeacherItem, TeacherForm>({
    key: "/teachers",
    listFn: teacherService.list,
    createFn: async (data: TeacherForm): Promise<TeacherItem> => {
      const dto = convertFormToDto(data);
      const result = await teacherService.create([dto]);
      return result[0] as TeacherItem;
    },
    updateFn: async (
      id: string,
      data: Partial<TeacherForm>,
    ): Promise<TeacherItem> => {
      const partialDto = convertPartialFormToDto(data);
      const result = await teacherService.update(id, partialDto);
      return result;
    },
    deleteFn: teacherService.remove,
  });
