import axios from "axios";

// Vite dev server will call backend at http://localhost:8000
// If you deploy behind a proxy, set VITE_API_BASE in an env file.
const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1";

const api = axios.create({ baseURL });

// Attach token if present
api.interceptors.request.use((config) => {
  const t = localStorage.getItem("overmind_token");
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

export default api;
