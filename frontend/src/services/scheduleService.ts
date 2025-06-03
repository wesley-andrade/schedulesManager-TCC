import { api } from "./api";

export interface Schedule {
  id: number;
  dayOfWeek:
    | "Segunda-feira"
    | "Terça-feira"
    | "Quarta-feira"
    | "Quinta-feira"
    | "Sexta-feira";
  timeSlotId: number;
  timeSlot: {
    id: number;
    startTime: string;
    endTime: string;
  };
}

export const scheduleService = {
  async getAllSchedules(): Promise<Schedule[]> {
    try {
      const response = await api.get("/schedules");
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

  async createSchedule(
    data: Omit<Schedule, "id" | "timeSlot">
  ): Promise<Schedule> {
    try {
      const response = await api.post("/schedules", data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao criar horário: ${error.message}`
      );
    }
  },

  async updateSchedule(
    id: number,
    data: Partial<Omit<Schedule, "id" | "timeSlot">>
  ): Promise<Schedule> {
    try {
      const response = await api.put(`/schedules/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao atualizar horário: ${error.message}`
      );
    }
  },

  async deleteSchedule(id: number): Promise<void> {
    try {
      await api.delete(`/schedules/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          `Erro ao excluir horário: ${error.message}`
      );
    }
  },
};
