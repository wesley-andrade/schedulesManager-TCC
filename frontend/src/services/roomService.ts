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
    try {
      const response = await api.get("/rooms");
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar salas."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar salas (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async deleteRoom(id: number): Promise<void> {
    try {
      await api.delete(`/rooms/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir sala"
      );
    }
  },

  async updateRoom(
    id: number,
    roomData: Partial<Room>
  ): Promise<Room> {
    try {
      const response = await api.put(`/rooms/${id}`, roomData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao atualizar sala");
    }
  },

  async createRoom(
    roomData: Omit<Room, "id">
  ): Promise<Room> {
    try {
      const response = await api.post("/rooms", roomData);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao criar sala");
    }
  },
}; 