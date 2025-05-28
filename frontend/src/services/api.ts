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
