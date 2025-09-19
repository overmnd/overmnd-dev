import axios from "axios";

// Backend base URL; keep overridable via env for production
const base =
  (import.meta.env.VITE_API_URL || "http://localhost:8000") + "/api/v1";

const api = axios.create({
  baseURL: base,
  timeout: 15000
});

// Attach Authorization header from localStorage if present
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("overmind_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// Optional: clear token on 401
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("overmind_token");
    }
    return Promise.reject(error);
  }
);

export default api;
