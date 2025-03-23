import axios from "axios";

export const client = axios.create({
  // biome-ignore lint/style/useNamingConvention: <explanation>
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});
