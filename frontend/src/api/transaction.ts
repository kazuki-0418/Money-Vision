import type { Transaction } from "../types/transaction";
import { client } from "./client";

const BASE_URL_TRANSACTIONS = "/api/transactions";

export const loadTransactionsApi = async (params = {}): Promise<Transaction[]> => {
  const response = await client.get(BASE_URL_TRANSACTIONS, { params });
  return response.data.data;
};

export const searchTransactionsApi = (searchParams: {
  accountId?: string;
  type?: string;
  description?: string;
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
}) => {
  return client.get(`${BASE_URL_TRANSACTIONS}/search"`, { params: searchParams });
};

export const getAccountTransactionsApi = (accountId: string, params = {}) => {
  return client.get(`${BASE_URL_TRANSACTIONS}/account/${accountId}`, { params });
};

export const getTransactionApi = (id: string) => {
  return client.get(`${BASE_URL_TRANSACTIONS}/${id}`);
};

export const createTransactionApi = (
  transactionData: Omit<Transaction, "id" | "date"> & {
    date: string;
  },
) => {
  return client.post(BASE_URL_TRANSACTIONS, transactionData);
};

export const createTransactionsApi = (transactionsData: Omit<Transaction, "id">[]) => {
  return client.post(`${BASE_URL_TRANSACTIONS}/bulk`, transactionsData);
};

export const updateTransactionApi = (
  id: string,
  transactionData: Omit<Transaction, "id" | "date"> & {
    date: string;
  },
) => {
  return client.put(`${BASE_URL_TRANSACTIONS}/${id}`, transactionData);
};

export const deleteTransactionApi = async (id: string): Promise<Transaction[]> => {
  const response = await client.delete(`${BASE_URL_TRANSACTIONS}/${id}`);
  return response.data.data;
};
