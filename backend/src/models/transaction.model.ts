import { v4 as uuidv4 } from 'uuid';
import { Transaction, TransactionCreate, TransactionUpdate } from '../types';

// In-memory database for transactions
class TransactionModel {
  private transactions: Transaction[] = [];

  // Create a new transaction
  create(userId: string, transactionData: TransactionCreate): Transaction {
    const newTransaction: Transaction = {
      id: uuidv4(),
      userId,
      accountId: transactionData.accountId,
      amount: transactionData.amount,
      description: transactionData.description,
      category: transactionData.category,
      date: transactionData.date,
      type: transactionData.type,
      merchant: transactionData.merchant,
      tags: transactionData.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.transactions.push(newTransaction);
    return newTransaction;
  }

  // Find transaction by ID
  findById(id: string): Transaction | undefined {
    return this.transactions.find(transaction => transaction.id === id);
  }

  // Find transactions by user ID
  findByUserId(userId: string, limit = 100, offset = 0): Transaction[] {
    return this.transactions
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(offset, offset + limit);
  }

  // Find transactions by account ID
  findByAccountId(accountId: string, limit = 100, offset = 0): Transaction[] {
    return this.transactions
      .filter(transaction => transaction.accountId === accountId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(offset, offset + limit);
  }

  // Search transactions
  search(userId: string, query: string, limit = 100, offset = 0): Transaction[] {
    const lowerQuery = query.toLowerCase();
    
    return this.transactions
      .filter(transaction => 
        transaction.userId === userId && (
          transaction.description.toLowerCase().includes(lowerQuery) ||
          transaction.category.toLowerCase().includes(lowerQuery) ||
          transaction.merchant?.toLowerCase().includes(lowerQuery) ||
          transaction.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
        )
      )
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(offset, offset + limit);
  }

  // Update transaction
  update(id: string, updateData: TransactionUpdate): Transaction | undefined {
    const transactionIndex = this.transactions.findIndex(transaction => transaction.id === id);
    
    if (transactionIndex === -1) {
      return undefined;
    }

    this.transactions[transactionIndex] = {
      ...this.transactions[transactionIndex],
      ...updateData,
      updatedAt: new Date()
    };

    return this.transactions[transactionIndex];
  }

  // Delete transaction
  delete(id: string): boolean {
    const initialLength = this.transactions.length;
    this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    return initialLength > this.transactions.length;
  }

  // Seed some test data
  seedTestData(userId: string, accountId: string): void {
    const transactions = [
      {
        accountId,
        amount: -3500,
        description: 'スターバックス',
        category: '飲食',
        date: new Date(2023, 8, 15),
        type: 'expense' as const,
        merchant: 'Starbucks',
        tags: ['コーヒー', '仕事']
      },
      {
        accountId,
        amount: -12000,
        description: '居酒屋さくら',
        category: '飲食',
        date: new Date(2023, 8, 14),
        type: 'expense' as const,
        merchant: '居酒屋さくら',
        tags: ['夕食', '友達']
      },
      {
        accountId,
        amount: -65000,
        description: 'アパート家賃',
        category: '住居',
        date: new Date(2023, 8, 1),
        type: 'expense' as const,
        merchant: 'パークハイツ不動産',
        tags: ['固定費', '住居']
      },
      {
        accountId,
        amount: 320000,
        description: '給料',
        category: '収入',
        date: new Date(2023, 8, 25),
        type: 'income' as const,
        merchant: '株式会社テクノロジー',
        tags: ['給料', '仕事']
      },
      {
        accountId,
        amount: -8500,
        description: 'アマゾン',
        category: 'ショッピング',
        date: new Date(2023, 8, 10),
        type: 'expense' as const,
        merchant: 'Amazon',
        tags: ['オンラインショッピング']
      }
    ];

    transactions.forEach(transaction => this.create(userId, transaction));
  }
}

export default new TransactionModel();
