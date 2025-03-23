// src/services/supabase/account.service.ts

import { BankAccount, BankAccountCreate, BankAccountUpdate } from "../../types/accounts";
import { getSupabaseClient, handleSupabaseError } from "./supabase-client";

export const AccountService = {
  async getBankAccounts(userId: string): Promise<BankAccount[]> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("bank_accounts")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        handleSupabaseError(error, "getBankAccounts");
        return [];
      }

      const accounts = data.map((account) => ({
        id: account.id,
        userId: account.user_id,
        accountNumber: account.account_number,
        accountName: account.account_name,
        balance: account.balance,
        currency: account.currency,
        type: account.type,
        createdAt: account.created_at,
        updatedAt: account.updated_at,
      }));

      return accounts || [];
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getBankAccounts");
        return [];
      }
      return [];
    }
  },

  async getBankAccount(accountId: string): Promise<BankAccount | null> {
    try {
      const { data, error } = await getSupabaseClient()
        .from("bank_accounts")
        .select("*")
        .eq("id", accountId)
        .single();

      if (error) {
        handleSupabaseError(error, "getBankAccount");
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        accountNumber: data.account_number,
        accountName: data.account_name,
        balance: data.balance,
        currency: data.currency,
        type: data.type,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getBankAccount");
        return null;
      }
      return null;
    }
  },

  async createBankAccount(accountData: BankAccountCreate): Promise<BankAccount | null> {
    const { accountName, accountNumber, balance, currency, type, userId } = accountData;
    try {
      const { data, error } = await getSupabaseClient(true)
        .from("bank_accounts")
        .insert([
          {
            account_name: accountName,
            account_number: accountNumber,
            balance,
            currency,
            type,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, "createBankAccount");
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getBankAccounts");
        return null;
      }
      return null;
    }
  },

  async updateBankAccount(
    accountId: string,
    accountData: BankAccountUpdate,
  ): Promise<BankAccount | null> {
    const { accountName, accountNumber, balance, currency, type } = accountData;
    try {
      const { data, error } = await getSupabaseClient()
        .from("bank_accounts")
        .update({
          account_name: accountName,
          account_number: accountNumber,
          balance,
          currency,
          type,
        })
        .eq("id", accountId)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, "updateBankAccount");
        return null;
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "getBankAccounts");
        return null;
      }
      return null;
    }
  },

  async updateBankAccountBalance(accountId: string, amount: number): Promise<boolean> {
    try {
      const account = await this.getBankAccount(accountId);
      if (!account) return false;

      const updatedBalance = account.balance + amount;

      const { error } = await getSupabaseClient()
        .from("bank_accounts")
        .update({ balance: updatedBalance })
        .eq("id", accountId);

      if (error) {
        handleSupabaseError(error, "updateBankAccountBalance");
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "updateBankAccountBalance");
        return false;
      }
      return false;
    }
  },

  async deleteBankAccount(accountId: string): Promise<boolean> {
    try {
      const { error } = await getSupabaseClient()
        .from("bank_accounts")
        .delete()
        .eq("id", accountId);

      if (error) {
        handleSupabaseError(error, "deleteBankAccount");
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof Error) {
        handleSupabaseError(error, "deleteBankAccount");
        return false;
      }
      return false;
    }
  },
};
