import { BankAccount, Transaction } from '../types';
import { v4 as uuidv4 } from 'uuid';

// This is a mock bank API service to simulate fetching data from a bank
class BankApiService {
  // Mock method to fetch account balance
  async fetchAccountBalance(userId: string, accountId: string): Promise<{ 
    success: boolean; 
    data?: { balance: number; currency: string; };
    error?: string;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulate successful response with random balance
    return {
      success: true,
      data: {
        balance: Math.floor(Math.random() * 1000000),
        currency: 'JPY'
      }
    };
  }

  // Mock method to fetch transactions
  async fetchTransactions(userId: string, accountId: string, fromDate?: Date, toDate?: Date): Promise<{
    success: boolean;
    data?: Transaction[];
    error?: string;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random transactions
    const transactions: Transaction[] = [];
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    // Use provided date range or default to last month
    const startDate = fromDate || oneMonthAgo;
    const endDate = toDate || now;
    
    // Generate some mock merchants
    const merchants = [
      'スーパーマーケットABC', 'コンビニ123', 'レストランさくら', 
      'カフェモーニング', 'アマゾン', '楽天市場', 'ヤマダ電機', 
      'ユニクロ', '東京メトロ', 'タクシー会社A'
    ];
    
    // Generate some mock categories
    const categories = [
      '食費', '交通費', 'ショッピング', '娯楽', '住居', '水道光熱費', 
      '通信費', '医療費', '教育費', '保険'
    ];
    
    // Generate random number of transactions (between 5 and 20)
    const transactionCount = Math.floor(Math.random() * 15) + 5;
    
    for (let i = 0; i < transactionCount; i++) {
      // Random date within range
      const transactionDate = new Date(
        startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
      );
      
      // Random amount (mostly expenses, some income)
      const isExpense = Math.random() > 0.2;
      const amount = isExpense 
        ? -Math.floor(Math.random() * 10000) - 500  // Expense (negative)
        : Math.floor(Math.random() * 100000) + 10000; // Income (positive)
      
      const merchantIndex = Math.floor(Math.random() * merchants.length);
      const categoryIndex = Math.floor(Math.random() * categories.length);
      
      transactions.push({
        id: uuidv4(),
        userId,
        accountId,
        amount,
        description: `${merchants[merchantIndex]} - ${categories[categoryIndex]}`,
        category: categories[categoryIndex],
        date: transactionDate,
        type: isExpense ? 'expense' : 'income',
        merchant: merchants[merchantIndex],
        tags: [categories[categoryIndex]],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Sort by date (newest first)
    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
    
    return {
      success: true,
      data: transactions
    };
  }

  // Mock method to fetch all accounts
  async fetchAccounts(userId: string): Promise<{
    success: boolean;
    data?: BankAccount[];
    error?: string;
  }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create mock accounts
    const accounts: BankAccount[] = [
      {
        id: uuidv4(),
        userId,
        accountNumber: '1234567890',
        accountName: '普通預金',
        balance: Math.floor(Math.random() * 500000) + 100000,
        currency: 'JPY',
        type: 'checking',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId,
        accountNumber: '0987654321',
        accountName: '貯蓄預金',
        balance: Math.floor(Math.random() * 2000000) + 500000,
        currency: 'JPY',
        type: 'savings',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        userId,
        accountNumber: '5678901234',
        accountName: 'クレジットカード',
        balance: -Math.floor(Math.random() * 100000),
        currency: 'JPY',
        type: 'credit',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    return {
      success: true,
      data: accounts
    };
  }
}

export default new BankApiService();
