import { api } from "./api";

export interface Module {
  id: number;
  name: string;
  totalStudents: number;
}

export const moduleService = {
  async getAllModules(): Promise<Module[]> {
    try {
      const response = await api.get("/modules");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar turmas."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar turmas (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async deleteModule(id: number): Promise<void> {
    try {
      await api.delete(`/modules/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir turma"
      );
    }
  },

  async updateModule(
    id: number,
    moduleData: Partial<Module>
  ): Promise<Module> {
    try {
      const response = await api.put(`/modules/${id}`, moduleData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao atualizar turma");
    }
  },

  async createModule(
    moduleData: Omit<Module, "id">
  ): Promise<Module> {
    try {
      const response = await api.post("/modules", moduleData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao criar turma");
    }
  },
}; 