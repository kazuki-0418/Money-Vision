import { BankAccount, Transaction } from "../types";

// This is a mock Supabase service to simulate database operations
// In a real application, this would use the actual Supabase client
class SupabaseService {
  // Mock storage
  private transactions: Record<string, Transaction[]> = {};
  private accounts: Record<string, BankAccount[]> = {};

  // Save transaction to "Supabase"
  async saveTransaction(userId: string, transaction: Transaction): Promise<Transaction> {
    if (!this.transactions[userId]) {
      this.transactions[userId] = [];
    }
    this.transactions[userId].push(transaction);
    return transaction;
  }

  // Save multiple transactions
  async saveTransactions(userId: string, transactions: Transaction[]): Promise<Transaction[]> {
    if (!this.transactions[userId]) {
      this.transactions[userId] = [];
    }
    this.transactions[userId] = [...this.transactions[userId], ...transactions];
    return transactions;
  }

  // Get transactions for a user
  async getTransactions(userId: string): Promise<Transaction[]> {
    return this.transactions[userId] || [];
  }

  // Save account to "Supabase"
  async saveBankAccount(userId: string, account: BankAccount): Promise<BankAccount> {
    if (!this.accounts[userId]) {
      this.accounts[userId] = [];
    }
    this.accounts[userId].push(account);
    return account;
  }

  // Get bank accounts for a user
  async getBankAccounts(userId: string): Promise<BankAccount[]> {
    return this.accounts[userId] || [];
  }

  // Update a transaction
  async updateTransaction(
    userId: string,
    transactionId: string,
    updates: Partial<Transaction>,
  ): Promise<Transaction | null> {
    if (!this.transactions[userId]) {
      return null;
    }

    const index = this.transactions[userId].findIndex((t) => t.id === transactionId);
    if (index === -1) {
      return null;
    }

    this.transactions[userId][index] = {
      ...this.transactions[userId][index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.transactions[userId][index];
  }

  // Delete a transaction
  async deleteTransaction(userId: string, transactionId: string): Promise<boolean> {
    if (!this.transactions[userId]) {
      return false;
    }

    const initialLength = this.transactions[userId].length;
    this.transactions[userId] = this.transactions[userId].filter((t) => t.id !== transactionId);

    return initialLength > this.transactions[userId].length;
  }

  // Search transactions
  async searchTransactions(userId: string, query: string): Promise<Transaction[]> {
    if (!this.transactions[userId]) {
      return [];
    }

    const lowerQuery = query.toLowerCase();

    return this.transactions[userId].filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(lowerQuery) ||
        transaction.category.toLowerCase().includes(lowerQuery) ||
        transaction.merchant?.toLowerCase().includes(lowerQuery) ||
        transaction.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    );
  }
}

export default new SupabaseService();
