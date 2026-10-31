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
    const { data } = await api.get<Schedule[]>("/schedules");
    return data;
  },

  async createSchedule(
    scheduleData: Omit<Schedule, "id" | "timeSlot">,
  ): Promise<Schedule> {
    const { data } = await api.post<Schedule>("/schedules", scheduleData);
    return data;
  },

  async updateSchedule(
    id: number,
    scheduleData: Partial<Omit<Schedule, "id" | "timeSlot">>,
  ): Promise<Schedule> {
    const { data } = await api.put<Schedule>(
      `/schedules/${id}`,
      scheduleData,
    );
    return data;
  },

  async deleteSchedule(id: number): Promise<void> {
    await api.delete(`/schedules/${id}`);
  },
};
