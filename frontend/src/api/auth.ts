import { client } from "./client";

const BASE_URL_USERS = "/api/users";

export const loginApi = (credentials: {
  email: string;
  password: string;
}) => {
  return client.post(`${BASE_URL_USERS}/login`, credentials);
};

export const registerApi = (userData: {
  username: string;
  email: string;
  password: string;
}) => {
  return client.post(`${BASE_URL_USERS}/register`, userData);
};

export const logoutApi = () => {
  return client.post(`${BASE_URL_USERS}/logout`);
};

export const refreshTokenApi = (token: {
  token: string;
}) => {
  return client.post(`${BASE_URL_USERS}/refresh`, { token });
};

export const getCurrentUserApi = () => {
  return client.get(`${BASE_URL_USERS}/me`);
};
