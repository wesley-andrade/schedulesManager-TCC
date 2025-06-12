import { api } from "./api";
import { RoomType } from "./roomService";

export interface Discipline {
  id: number;
  name: string;
  totalHours: number;
  requiredRoomType: RoomType;
  disciplineCourses?: {
    id: number;
    course: {
      id: number;
      name: string;
    };
  }[];
}

export interface DisciplinePayload {
  name: string;
  totalHours: number;
  requiredRoomType: RoomType;
  courseId?: number;
}

export const disciplineService = {
  async getAllDisciplines(): Promise<Discipline[]> {
    try {
      const response = await api.get("/disciplines");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar disciplinas."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar disciplinas (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async createDiscipline(data: DisciplinePayload): Promise<Discipline> {
    try {
      const response = await api.post("/disciplines", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao criar disciplina: ${error.message}`
      );
    }
  },

  async updateDiscipline(
    id: number,
    data: DisciplinePayload
  ): Promise<Discipline> {
    try {
      const response = await api.put(`/disciplines/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao atualizar disciplina: ${error.message}`
      );
    }
  },

  async deleteDiscipline(id: number): Promise<void> {
    try {
      await api.delete(`/disciplines/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao excluir disciplina: ${error.message}`
      );
    }
  },
};
