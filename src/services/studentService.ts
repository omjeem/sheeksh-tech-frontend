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
        srNo: number;
        createdAt: string;
        user: {
          id: string;
          email: string;
          firstName: string;
          lastName: string;
          dateOfBirth: string | null;
        };
      }[]
    >(`/student${qp}`);
    return rawData.map((item) => ({
      id: item.id,
      srNo: item.srNo,
      firstName: item.user.firstName,
      lastName: item.user.lastName,
      email: item.user.email,
      dateOfBirth: item.user.dateOfBirth ?? undefined,
      createdAt: item.createdAt,
      sectionId: "",
      sessionId: "",
    }));
  },
  create: async (payload: BulkStudentPayload): Promise<StudentDto[]> => {
    return api.post<StudentDto[]>("/student", payload);
  },
  update: (id: string, data: Partial<StudentDto>): Promise<StudentDto> =>
    baseService.update(id, data),
  remove: (id: string): Promise<void> => baseService.remove(id),
};
