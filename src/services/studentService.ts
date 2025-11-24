import type { StudentDto } from "@/types";
import { createCRUDService } from "./baseCRUDService";
import { api } from "@/lib/api";

type BulkStudentPayload = {
  classId: string;
  sectionId: string;
  sessionId: string;
  selfAssignSr: boolean;
  studentData: Array<{
    srNo: number;
    firstName: string;
    lastName?: string;
    email?: string;
    password?: string;
    dateOfBirth?: string; // DD-MM-YYYY
  }>;
};

const baseService = createCRUDService<StudentDto, BulkStudentPayload>(
  "/student",
);

// Override create to use bulk payload for both single and bulk
export const studentService = {
  ...baseService,
  list: async (params?: {
    classId?: string;
    sectionId?: string;
  }): Promise<StudentDto[]> => {
    const qp = params ? `?${new URLSearchParams(params)}` : "";
    const rawData = await api.get<
      {
        id: string;
        studentId: string;
        student: {
          srNo: number;
          user: {
            firstName: string;
            lastName: string;
            email: string;
          };
        };
        class: {
          id: string;
          name: string;
        };
        section: {
          id: string;
          name: string;
        };
        session: {
          id: string;
          name: string;
        };
      }[]
    >(`/student${qp}`);
    return rawData.map((item) => ({
      id: item.id,
      srNo: item.student.srNo,
      firstName: item.student.user.firstName,
      lastName: item.student.user.lastName,
      email: item.student.user.email,
      dateOfBirth: item.student.user.dateOfBirth ?? undefined,
      createdAt: item.createdAt,
      sectionId: item.section.id,
      sessionId: item.session.id,
    }));
  },
  create: async (payload: BulkStudentPayload): Promise<StudentDto[]> => {
    return api.post<StudentDto[]>("/student", payload);
  },
  update: (id: string, data: Partial<StudentDto>): Promise<StudentDto> =>
    baseService.update(id, data),
  remove: (id: string): Promise<void> => baseService.remove(id),
};
