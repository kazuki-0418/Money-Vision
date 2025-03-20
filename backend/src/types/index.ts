// User-related types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

// Bank account related types
export interface BankAccount {
  id: string;
  userId: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit';
  createdAt: Date;
  updatedAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense' | 'transfer';
  merchant?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionCreate {
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: 'income' | 'expense' | 'transfer';
  merchant?: string;
  tags?: string[];
}

export interface TransactionUpdate {
  amount?: number;
  description?: string;
  category?: string;
  date?: Date;
  type?: 'income' | 'expense' | 'transfer';
  merchant?: string;
  tags?: string[];
}

// Request types extending Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
      };
    }
  }
}
