import { client } from "./client";

export const getAccounts = async () => {
  return client.get("/accounts");
};

export const getAccountById = async (id: string) => {
  return client.get(`/accounts/${id}`);
};

export const refreshBalances = async () => {
  return client.get("/accounts/refresh");
};
