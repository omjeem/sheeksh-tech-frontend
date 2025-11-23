export type LoginDto = {
  email: string;
  password: string;
  isSuperAdmin?: boolean;
};
export type LoginResponse = {
  token: string;
  user: { role: string; email: string };
};
// types/index.ts
export type ClassDto = {
  id: string;
  name: string;
  description?: string | null;
};

export type ClassCreateDto = {
  name: string;
  description?: string;
};

export type SectionDto = {
  id: string;
  classId: string;
  name: string;
};

export type SectionCreateDto = {
  classId: string;
  name: string;
};

export type StudentDto = {
  id: string;
  srNo?: number;
  firstName: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  createdAt?: string;
  sectionId: string;
  sessionId: string;
};

export type StudentCreateDto = {
  sectionId: string;
  sessionId: string;
  firstName: string;
  lastName?: string;
  email?: string;
  password?: string;
  dateOfBirth?: string;
};

export type SessionDto = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

export type SessionCreateDto = {
  name: string;
  startDate: string;
  endDate: string;
  isActive?: boolean;
};

export type SubjectDto = {
  id: string;
  name: string;
  code?: string;
};

export type SubjectCreateDto = {
  name: string;
  code?: string;
};

export type TeacherDto = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  designation: "TGT" | "PGT";
  startDate: string;
  endDate?: string | null;
  dateOfBirth: string;
};

export type TeacherCreateDto = {
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
  designation: "TGT" | "PGT";
  dateOfBirth: string; // dd-MM-yyyy
  startDate: string; // dd-MM-yyyy
  endDate?: string | null;
};
