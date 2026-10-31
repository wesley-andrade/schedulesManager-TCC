import { api } from "./api";

export interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

export const timeSlotService = {
  async getAllTimeSlots(): Promise<TimeSlot[]> {
    const { data } = await api.get<TimeSlot[]>("/time-slots");
    return data;
  },

  async createTimeSlot(timeSlotData: Omit<TimeSlot, "id">): Promise<TimeSlot> {
    const { data } = await api.post<TimeSlot>("/time-slots", timeSlotData);
    return data;
  },

  async updateTimeSlot(
    id: number,
    timeSlotData: Partial<Omit<TimeSlot, "id">>,
  ): Promise<TimeSlot> {
    const { data } = await api.put<TimeSlot>(
      `/time-slots/${id}`,
      timeSlotData,
    );
    return data;
  },

  async deleteTimeSlot(id: number): Promise<void> {
    await api.delete(`/time-slots/${id}`);
  },
};
