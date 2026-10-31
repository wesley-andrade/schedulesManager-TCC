import { api } from "./api";

export interface Teacher {
  id: number;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const teacherService = {
  async getAllTeachers(): Promise<Teacher[]> {
    const { data } = await api.get<Teacher[]>("/teachers");
    return data;
  },
};
