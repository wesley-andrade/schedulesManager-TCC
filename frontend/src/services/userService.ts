import axios from "axios";
import { api } from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "standard";
  password?: string;
}

export const EMAIL_ALREADY_REGISTERED = "email já está cadastrado";

function toUserPayload(userData: Partial<User>): Partial<User> {
  const payload = { ...userData };

  if (!payload.password) {
    delete payload.password;
  }

  const phoneDigits = payload.phone?.replace(/\D/g, "");
  if (phoneDigits) {
    payload.phone = phoneDigits;
  } else {
    delete payload.phone;
  }

  return payload;
}

function rethrowSaveError(error: unknown): never {
  if (axios.isAxiosError(error) && error.response?.status === 409) {
    throw new Error(EMAIL_ALREADY_REGISTERED);
  }

  throw error;
}

export const userService = {
  async getAllUsers(): Promise<User[]> {
    const { data } = await api.get<{ users: User[] }>("/users");
    return data.users;
  },

  async createUser(userData: Omit<User, "id">): Promise<User> {
    try {
      const { data } = await api.post<{ userWithoutPassword: User }>(
        "/auth/register",
        toUserPayload(userData),
      );
      return data.userWithoutPassword;
    } catch (error) {
      rethrowSaveError(error);
    }
  },

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const { data } = await api.put<User>(
        `/users/${id}`,
        toUserPayload(userData),
      );
      return data;
    } catch (error) {
      rethrowSaveError(error);
    }
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/users/${id}`);
  },
};
