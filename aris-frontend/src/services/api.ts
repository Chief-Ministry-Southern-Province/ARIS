import axios from "axios";
import { normalizeApiError } from "@/utils/errorMessage";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000/api";
export const API_ORIGIN = new URL(API_BASE_URL, window.location.origin).origin;
// Laravel app root (API base without the trailing "/api"), e.g. "/aris-api" or "http://localhost:8000".
// Used for non-API endpoints such as /sanctum/csrf-cookie.
export const API_ROOT = API_BASE_URL.replace(/\/api\/?$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 1200000,
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
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
