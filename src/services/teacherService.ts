import type { TeacherDto, TeacherCreateDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";
import { api } from "@/lib/api";

const baseService = createCRUDService<TeacherDto, TeacherCreateDto>("/teacher");

export const createBulk = async (
  payload: TeacherCreateDto[] | TeacherCreateDto,
): Promise<TeacherDto[]> => {
  const teachers = Array.isArray(payload) ? payload : [payload];
  return api.post<TeacherDto[]>("/teacher", teachers);
};

const createClassMap = async (payload: {
  teacherId: string;
  classId: string;
  sessionId: string;
  sectionId?: string;
  subjectId?: string;
  fromDate?: string;
}): Promise<void> => {
  return api.post<void>("/teacher/teacher-class", payload);
};

export const list = async (): Promise<TeacherDto[]> => {
  const { teachers } = await api.get<{
    teachers: {
      id: string;
      startDate: string;
      endDate: string | null;
      designation: "TGT" | "PGT";
      user: {
        email: string;
        dateOfBirth: string;
        firstName: string;
        lastName: string;
      };
    }[];
  }>("/teacher");
  return teachers?.map((t) => ({
    id: t.id,
    firstName: t.user.firstName,
    lastName: t.user.lastName,
    email: t.user.email,
    designation: t.designation,
    startDate: t.startDate,
    endDate: t.endDate,
    dateOfBirth: t.user.dateOfBirth,
  }));
};

export const update = (
  id: string,
  data: Partial<TeacherCreateDto>,
): Promise<TeacherDto> => baseService.update(id, data);

export const remove = (id: string): Promise<void> => baseService.remove(id);

export const teacherService = {
  list,
  getMapping: async (params: {
    classId?: string | null;
    teacherId?: string | null;
    sectionId?: string | null;
    sessionId?: string | null;
  }) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(
        ([_, value]) => value !== undefined && value !== null && value !== "",
      ),
    );

    const qp =
      Object.keys(cleanParams).length > 0
        ? `?${new URLSearchParams(cleanParams)}`
        : "";
    return api.get("/teacher/teacher-class" + qp).then((data) =>
      data?.map((assignment) => ({
        id: assignment.id,
        firstName: assignment.teacher.user.firstName,
        lastName: assignment.teacher.user.lastName,
        email: assignment.teacher.user.email,
        designation: "TGT" as const,
        startDate: assignment.fromDate,
        endDate: assignment.endDate,
        dateOfBirth: "",
        className: assignment.class.name,
        sectionName: assignment.section.name,
        subjectName: assignment.subject.subject,
        sessionName: assignment.session.name,
        schoolName: assignment.school.name,
        isActive: assignment.isActive,
      })),
    );
  },
  create: createBulk as (
    payload: TeacherCreateDto[] | TeacherCreateDto,
  ) => Promise<TeacherDto[]>,
  update,
  remove,
  createClassMap,
};
