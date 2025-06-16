import { api } from "./api";
import { formatPhoneNumber } from "@/utils/formatters";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "standard";
  password?: string;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get("/users");

      if (!response.data.users) {
        console.warn(
          "Resposta da API não contém a propriedade 'users':",
          response.data
        );
        throw new Error("Formato de resposta inválido da API");
      }

      return response.data.users;
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 403) {
        throw new Error(
          "Você não tem permissão para acessar esta página. Apenas administradores podem gerenciar usuários."
        );
      }

      throw new Error(
        error.response?.data?.message ||
          `Erro ao buscar usuários (${
            error.response?.status || "sem status"
          }): ${error.message}`
      );
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      await api.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Erro ao excluir usuário"
      );
    }
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const dataToSend = { ...userData };
      if (dataToSend.password === "") {
        delete dataToSend.password;
      }
      if (!dataToSend.phone || dataToSend.phone === "-") {
        delete dataToSend.phone;
      } else {
        dataToSend.phone = formatPhoneNumber(dataToSend.phone).replace("-", "");
      }

      const response = await api.put(`/users/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        throw new Error("email já está cadastrado");
      }
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message.toLowerCase();
        if (
          errorMessage.includes("email já existe") ||
          errorMessage.includes(
            "já existe um registro com este valor para o campo email"
          )
        ) {
          throw new Error("email já está cadastrado");
        }
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao atualizar usuário");
    }
  },

  async createUser(userData: Omit<User, "id">): Promise<User> {
    try {
      const dataToSend = { ...userData };
      if (!dataToSend.phone || dataToSend.phone === "-") {
        delete dataToSend.phone;
      } else {
        dataToSend.phone = formatPhoneNumber(dataToSend.phone).replace("-", "");
      }

      const response = await api.post("/auth/register", dataToSend);
      return response.data.userWithoutPassword;
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 409) {
        throw new Error("email já está cadastrado");
      }
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message.toLowerCase();
        if (
          errorMessage.includes("email já existe") ||
          errorMessage.includes(
            "já existe um registro com este valor para o campo email"
          )
        ) {
          throw new Error("email já está cadastrado");
        }
        throw new Error(error.response.data.message);
      }
      throw new Error("Erro ao criar usuário");
    }
  },
};
