import { client } from "./client";

const BASE_URL_ACCOUNTS = "/api/accounts";

export const loadAccountsApi = async () => {
  const response = await client.get(BASE_URL_ACCOUNTS);
  return response.data.data;
};

export const getAccountById = async (id: string) => {
  const response = await client.get(`${BASE_URL_ACCOUNTS}/${id}`);

  return response.data.data;
};
