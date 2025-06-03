import { api } from "./api";

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

export const timeSlotService = {
  async getAllTimeSlots(): Promise<TimeSlot[]> {
    try {
      const response = await api.get("/time-slots");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar horários."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar horários (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async createTimeSlot(data: Omit<TimeSlot, "id">): Promise<TimeSlot> {
    try {
      const response = await api.post("/time-slots", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao criar horário: ${error.message}`
      );
    }
  },

  async updateTimeSlot(
    id: number,
    data: Partial<Omit<TimeSlot, "id">>
  ): Promise<TimeSlot> {
    try {
      const response = await api.put(`/time-slots/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao atualizar horário: ${error.message}`
      );
    }
  },

  async deleteTimeSlot(id: number): Promise<void> {
    try {
      await api.delete(`/time-slots/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao excluir horário: ${error.message}`
      );
    }
  },
};
