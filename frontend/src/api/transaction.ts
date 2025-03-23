import { client } from "./client";

export const loadTransactionsApi = (params = {}) => {
  return client.get("/transactions", { params });
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
  return client.get("/transactions/search", { params: searchParams });
};

export const getAccountTransactionsApi = (accountId: string, params = {}) => {
  return client.get(`/transactions/account/${accountId}`, { params });
};

export const getTransactionApi = (id: string) => {
  return client.get(`/transactions/${id}`);
};

export const createTransactionApi = (transactionData: {
  accountId: string;
  amount: number;
  type: string;
  description: string;
  date: string;
}) => {
  return client.post("/transactions", transactionData);
};

export const updateTransactionApi = (
  id: string,
  transactionData: {
    accountId: string;
    amount: number;
    type: string;
    description: string;
    date: string;
  },
) => {
  return client.put(`/transactions/${id}`, transactionData);
};

export const deleteTransactionApi = (id: string) => {
  return client.delete(`/transactions/${id}`);
};
