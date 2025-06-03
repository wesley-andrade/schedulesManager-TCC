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
    try {
      const response = await api.get("/teachers");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar professores."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar professores (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },
};
