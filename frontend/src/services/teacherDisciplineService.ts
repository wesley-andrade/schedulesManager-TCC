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
    try {
      const response = await api.get("/discipline-teachers");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar disciplinas do professor (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async createTeacherDiscipline(
    teacherId: number,
    disciplineId: number
  ): Promise<TeacherDiscipline> {
    try {
      const response = await api.post("/discipline-teachers", {
        teacherId,
        disciplineId,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erro ao associar disciplina ao professor"
      );
    }
  },

  async deleteTeacherDiscipline(id: number): Promise<void> {
    try {
      await api.delete(`/discipline-teachers/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "Erro ao remover disciplina do professor"
      );
    }
  },
};
