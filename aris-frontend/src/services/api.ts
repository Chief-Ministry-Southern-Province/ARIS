import axios from "axios";

const api = axios.create({
  //baseURL:"https://aris-api.hopto.org/api",
  baseURL: 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!(config.data instanceof FormData) && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;