import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/interfaces/repositories/TransactionRepository";
import { supabase } from "../config/db";

export class SupabaseTransactionRepository implements TransactionRepository {
  async findById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase.from("transactions").select("*").eq("id", id).single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      accountId: data.account_id,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      merchant: data.merchant,
      type: data.type,
      status: data.status,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
    };
  }

  async findByAccountId(accountId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("account_id", accountId)
      .order("date", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data.map((transaction) => {
      return {
        id: transaction.id,
        accountId: transaction.account_id,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        merchant: transaction.merchant,
        type: transaction.type,
        status: transaction.status,
        date: new Date(transaction.date),
        createdAt: new Date(transaction.created_at),
      };
    });
  }

  async save(transaction: Transaction): Promise<Transaction> {
    const { data, error } = await supabase
      .from("transactions")
      .upsert({
        id: transaction.id,
        account_id: transaction.accountId,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        merchant: transaction.merchant,
        type: transaction.type,
        status: transaction.status,
        date: transaction.date.toISOString(),
        created_at: transaction.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to save transaction: ${error?.message}`);
    }

    return {
      id: data.id,
      accountId: data.account_id,
      amount: data.amount,
      currency: data.currency,
      description: data.description,
      merchant: data.merchant,
      type: data.type,
      status: data.status,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
    };
  }
}
