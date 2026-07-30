import axios from "axios";

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const api = axios.create({
  //baseURL:"https://aris-api.hopto.org/api",
  baseURL: 'http://localhost:8000/api',
  timeout: 1200000,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
