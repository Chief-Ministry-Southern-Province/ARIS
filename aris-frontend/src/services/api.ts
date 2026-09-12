import axios from "axios";
import { normalizeApiError } from "@/utils/errorMessage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";
export const API_ORIGIN = new URL(API_BASE_URL).origin;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1200000,
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.request.use((config) => {
  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error))
);

export default api;
