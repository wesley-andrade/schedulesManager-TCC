import { ROUTES } from "@/config/routes";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("timewise_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("timewise_token");
      localStorage.removeItem("user");
      window.location.assign(ROUTES.HOME);
    }

    const backendMessage = error.response?.data?.message;
    if (typeof backendMessage === "string") {
      error.message = backendMessage;
    } else if (!error.response) {
      error.message = "Não foi possível conectar ao servidor";
    }

    return Promise.reject(error);
  },
);
