import axios from "axios";

const client = axios.create({
  // biome-ignore lint/style/useNamingConvention: <explanation>
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

export { client };
