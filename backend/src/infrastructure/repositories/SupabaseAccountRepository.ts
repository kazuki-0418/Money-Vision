import { Account } from "../../domain/entities/Account";
import { AccountRepository } from "../../domain/interfaces/repositories/AccountRepository";
import { supabase } from "../config/db";

export class SupabaseAccountRepository implements AccountRepository {
  async findById(id: string): Promise<Account | null> {
    const { data, error } = await supabase.from("accounts").select("*").eq("id", id).single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      accountNumber: data.account_number,
      balance: data.balance,
      currency: data.currency,
      type: data.type,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  async findByUserId(userId: string): Promise<Account[]> {
    const { data, error } = await supabase.from("accounts").select("*").eq("user_id", userId);

    if (error || !data) {
      return [];
    }

    return data.map((account) => ({
      id: account.id,
      userId: account.user_id,
      accountNumber: account.account_number,
      balance: account.balance,
      currency: account.currency,
      type: account.type,
      createdAt: new Date(account.created_at),
      updatedAt: new Date(account.updated_at),
    }));
  }

  async save(account: Account): Promise<Account> {
    const { data, error } = await supabase
      .from("accounts")
      .upsert({
        id: account.id,
        user_id: account.userId,
        account_number: account.accountNumber,
        balance: account.balance,
        currency: account.currency,
        type: account.type,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to save account: ${error?.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      accountNumber: data.account_number,
      balance: data.balance,
      currency: data.currency,
      type: data.type,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
