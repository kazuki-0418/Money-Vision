import { v4 as uuidv4 } from 'uuid';
import { BankAccount } from '../types';

// In-memory database for bank accounts
class BankAccountModel {
  private accounts: BankAccount[] = [];

  // Create a new bank account
  create(userId: string, accountData: Partial<BankAccount>): BankAccount {
    const newAccount: BankAccount = {
      id: uuidv4(),
      userId,
      accountNumber: accountData.accountNumber || this.generateAccountNumber(),
      accountName: accountData.accountName || 'Default Account',
      balance: accountData.balance || 0,
      currency: accountData.currency || 'JPY',
      type: accountData.type || 'checking',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.accounts.push(newAccount);
    return newAccount;
  }

  // Find account by ID
  findById(id: string): BankAccount | undefined {
    return this.accounts.find(account => account.id === id);
  }

  // Find accounts by user ID
  findByUserId(userId: string): BankAccount[] {
    return this.accounts.filter(account => account.userId === userId);
  }

  // Update account balance
  updateBalance(id: string, amount: number): BankAccount | undefined {
    const account = this.findById(id);
    if (!account) {
      return undefined;
    }

    account.balance += amount;
    account.updatedAt = new Date();
    return account;
  }

  // Delete account
  delete(id: string): boolean {
    const initialLength = this.accounts.length;
    this.accounts = this.accounts.filter(account => account.id !== id);
    return initialLength > this.accounts.length;
  }

  // Utility to generate a random account number
  private generateAccountNumber(): string {
    return Math.floor(Math.random() * 9000000000 + 1000000000).toString();
  }

  // Seed some test data
  seedTestData(userId: string): void {
    const accounts = [
      {
        accountNumber: '1234567890',
        accountName: '普通預金',
        balance: 250000,
        currency: 'JPY',
        type: 'checking' as const
      },
      {
        accountNumber: '0987654321',
        accountName: '貯蓄預金',
        balance: 1500000,
        currency: 'JPY',
        type: 'savings' as const
      },
      {
        accountNumber: '5678901234',
        accountName: 'クレジットカード',
        balance: -75000,
        currency: 'JPY',
        type: 'credit' as const
      }
    ];

    accounts.forEach(account => this.create(userId, account));
  }
}

export default new BankAccountModel();
