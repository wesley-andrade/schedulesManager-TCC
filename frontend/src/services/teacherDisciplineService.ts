import { api } from "./api";
import { Discipline } from "./disciplineService";

export interface TeacherDiscipline {
  id: number;
  teacherId: number;
  disciplineId: number;
  discipline?: Discipline;
}

export const teacherDisciplineService = {
  async getAllTeacherDisciplines(): Promise<TeacherDiscipline[]> {
    const { data } = await api.get<TeacherDiscipline[]>("/discipline-teachers");
    return data;
  },

  async createTeacherDiscipline(
    teacherId: number,
    disciplineId: number,
  ): Promise<TeacherDiscipline> {
    const { data } = await api.post<TeacherDiscipline>(
      "/discipline-teachers",
      { teacherId, disciplineId },
    );
    return data;
  },

  async deleteTeacherDiscipline(id: number): Promise<void> {
    await api.delete(`/discipline-teachers/${id}`);
  },
};
