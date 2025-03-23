// src/services/supabase/transaction.service.ts

import { Transaction, TransactionCreate, TransactionUpdate } from "../../types/transactions";
import { getSupabaseClient, handleSupabaseError } from "./supabase-client";

export const TransactionService = {
  async getTransactions(userId: string, limit = 100, offset = 0): Promise<Transaction[]> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("date", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        handleSupabaseError(error, "getTransactions");
        return [];
      }

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getTransactions");
        return [];
      }
      return [];
    }
  },

  async getAccountTransactions(accountId: string, limit = 100, offset = 0): Promise<Transaction[]> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("transactions")
        .select("*")
        .eq("account_id", accountId)
        .order("date", { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        handleSupabaseError(error, "getAccountTransactions");
        return [];
      }

      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getTransactions");
        return [];
      }
      return [];
    }
  },

  async getTransaction(transactionId: string): Promise<Omit<Transaction, "userId"> | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single();

      if (error) {
        handleSupabaseError(error, "getTransaction");
        return null;
      }

      return {
        id: data.id,
        accountId: data.account_id,
        amount: data.amount,
        category: data.category,
        date: data.date,
        description: data.description,
        merchant: data.merchant,
        tags: data.tags,
        type: data.type,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getTransaction");
        return null;
      }
      return null;
    }
  },

  async saveTransaction(
    userId: string,
    transaction: TransactionCreate,
  ): Promise<Transaction | null> {
    try {
      // 管理者権限でSupabaseにアクセス（RLSをバイパス）
      const { data, error } = await getSupabaseClient(true)
        .from("transactions")
        .insert([
          {
            account_id: transaction.accountId,
            amount: transaction.amount,
            category: transaction.category,
            date: transaction.date,
            description: transaction.description,
            merchant: transaction.merchant,
            tags: transaction.tags,
            type: transaction.type,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, "saveTransaction");
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getTransaction");
        return null;
      }
      return null;
    }
  },

  async saveTransactions(userId: string, transactions: TransactionCreate[]): Promise<boolean> {
    try {
      // ユーザーIDを各トランザクションに追加
      const transactionsWithUserId = transactions.map((t) => ({
        account_id: t.accountId,
        amount: t.amount,
        category: t.category,
        date: t.date,
        description: t.description,
        merchant: t.merchant,
        tags: t.tags,
        type: t.type,
        user_id: userId,
      }));

      // 管理者権限でSupabaseにアクセス（RLSをバイパス）
      const { error } = await getSupabaseClient(true)
        .from("transactions")
        .insert(transactionsWithUserId);

      if (error) {
        handleSupabaseError(error, "saveTransactions");
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "deleteTransaction");
        return false;
      }
      return false;
    }
  },

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateData: TransactionUpdate,
  ): Promise<Transaction | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("transactions")
        .update({
          amount: updateData.amount,
          category: updateData.category,
          date: updateData.date,
          description: updateData.description,
          merchant: updateData.merchant,
          tags: updateData.tags,
          type: updateData.type,
        })
        .eq("id", transactionId)
        .eq("user_id", userId) // 追加のセキュリティチェック
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, "updateTransaction");
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getTransaction");
        return null;
      }
      return null;
    }
  },

  async deleteTransaction(userId: string, transactionId: string): Promise<boolean> {
    try {
      const { error } = await getSupabaseClient()
        .from("transactions")
        .delete()
        .eq("id", transactionId)
        .eq("user_id", userId); // 追加のセキュリティチェック

      if (error) {
        handleSupabaseError(error, "deleteTransaction");
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "deleteTransaction");
        return false;
      }
      return false;
    }
  },

  async searchTransactions(
    userId: string,
    query: string,
    limit = 100,
    offset = 0,
  ): Promise<Omit<Transaction, "userId">[]> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .or(`description.ilike.%${query}%,category.ilike.%${query}%`)
        .range(offset, offset + limit - 1)
        .order("date", { ascending: false });

      if (error) {
        handleSupabaseError(error, "searchTransactions");
        return [];
      }

      const transactions = data.map((transaction) => ({
        id: transaction.id,
        accountId: transaction.account_id,
        amount: transaction.amount,
        category: transaction.category,
        date: transaction.date,
        description: transaction.description,
        merchant: transaction.merchant,
        tags: transaction.tags,
        type: transaction.type,
        createdAt: transaction.created_at,
        updatedAt: transaction.updated_at,
      }));

      return transactions || [];
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "searchTransactions");
        return [];
      }
      return [];
    }
  },
};
