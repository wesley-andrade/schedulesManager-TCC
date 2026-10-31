import { api } from "./api";

export enum RoomType {
  Comum = "Comum",
  Laboratório = "Laboratório",
  Auditório = "Auditório",
}

export interface Room {
  id: number;
  name: string;
  seatsAmount: number;
  type: RoomType;
}

export const roomService = {
  async getAllRooms(): Promise<Room[]> {
    const { data } = await api.get<Room[]>("/rooms");
    return data;
  },

  async createRoom(roomData: Omit<Room, "id">): Promise<Room> {
    const { data } = await api.post<Room>("/rooms", roomData);
    return data;
  },

  async updateRoom(id: number, roomData: Partial<Room>): Promise<Room> {
    const { data } = await api.put<Room>(`/rooms/${id}`, roomData);
    return data;
  },

  async deleteRoom(id: number): Promise<void> {
    await api.delete(`/rooms/${id}`);
  },
};
