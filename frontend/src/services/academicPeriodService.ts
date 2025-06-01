import { api } from "./api";

export interface AcademicPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

export const academicPeriodService = {
  async getAllAcademicPeriods(): Promise<AcademicPeriod[]> {
    try {
      const response = await api.get("/academic-periods");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar períodos acadêmicos."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar períodos acadêmicos (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async deletePeriod(id: number): Promise<void> {
    try {
      await api.delete(`/academic-periods/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir período acadêmico"
      );
    }
  },

  async updatePeriod(
    id: number,
    periodData: Partial<AcademicPeriod>
  ): Promise<AcademicPeriod> {
    try {
      const response = await api.put(`/academic-periods/${id}`, periodData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao atualizar período acadêmico");
    }
  },

  async createPeriod(
    periodData: Omit<AcademicPeriod, "id">
  ): Promise<AcademicPeriod> {
    try {
      const response = await api.post("/academic-periods", periodData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao criar período acadêmico");
    }
  },
};
