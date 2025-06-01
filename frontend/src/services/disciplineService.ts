import { api } from "./api";
import { RoomType } from "./roomService";

export interface Discipline {
  id: number;
  name: string;
  totalHours: number;
  requiredRoomType: RoomType;
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
}; 