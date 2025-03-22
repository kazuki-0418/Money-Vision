import { client } from "./client";

export const loginApi = (credentials: {
  email: string;
  password: string;
}) => {
  return client.post("/login", credentials);
};

export const registerApi = (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  return client.post("/register", userData);
};

export const logoutApi = () => {
  return client.post("/logout");
};

export const refreshTokenApi = (token: {
  token: string;
}) => {
  return client.post("/auth/refresh", { token });
};

export const getCurrentUserApi = () => {
  return client.get("/auth/me");
};
