import { SupabaseService } from "../infrastructure/supabase";
import { Transaction, TransactionCreate, TransactionUpdate } from "../types/transactions";

class TransactionModel {
  private transactionService;

  constructor() {
    const { transaction } = SupabaseService;
    this.transactionService = transaction;
  }

  // 新しいトランザクションを作成
  async create(userId: string, transactionData: TransactionCreate): Promise<Transaction | null> {
    return await this.transactionService.saveTransaction(userId, transactionData);
  }

  // IDからトランザクションを検索
  async findById(id: string): Promise<Transaction | null> {
    return await this.transactionService.getTransaction(id);
  }

  // ユーザーIDからトランザクションを検索
  async findByUserId(userId: string, limit = 100, offset = 0): Promise<Transaction[]> {
    return await this.transactionService.getTransactions(userId, limit, offset);
  }

  // 口座IDからトランザクションを検索
  async findByAccountId(accountId: string, limit = 100, offset = 0): Promise<Transaction[]> {
    return await this.transactionService.getAccountTransactions(accountId, limit, offset);
  }

  // トランザクションを検索
  async search(userId: string, query: string, limit = 100, offset = 0): Promise<Transaction[]> {
    return await this.transactionService.searchTransactions(userId, query, limit, offset);
  }

  // トランザクションを更新
  async update(
    id: string,
    userId: string,
    updateData: TransactionUpdate,
  ): Promise<Transaction | null> {
    const transaction = await this.findById(id);
    if (!transaction) {
      return null;
    }

    const updatedTransaction: Transaction = {
      ...transaction,
      ...updateData,
    };

    return await this.transactionService.updateTransaction(userId, id, updatedTransaction);
  }

  // トランザクションを削除
  async delete(id: string, userId: string): Promise<boolean> {
    return await this.transactionService.deleteTransaction(userId, id);
  }

  // 複数のトランザクションを一括で保存
  async saveMany(userId: string, transactions: TransactionCreate[]): Promise<boolean> {
    return await this.transactionService.saveTransactions(userId, transactions);
  }

  // // テストデータを生成
  // async seedTestData(userId: string, accountId: string): Promise<void> {
  //   const transactions = [
  //     {
  //       accountId,
  //       amount: -3500,
  //       description: "スターバックス",
  //       category: "飲食",
  //       date: new Date(2023, 8, 15),
  //       type: "expense" as const,
  //       merchant: "Starbucks",
  //       tags: ["コーヒー", "仕事"],
  //     },
  //     {
  //       accountId,
  //       amount: -12000,
  //       description: "居酒屋さくら",
  //       category: "飲食",
  //       date: new Date(2023, 8, 14),
  //       type: "expense" as const,
  //       merchant: "居酒屋さくら",
  //       tags: ["夕食", "友達"],
  //     },
  //     {
  //       accountId,
  //       amount: -65000,
  //       description: "アパート家賃",
  //       category: "住居",
  //       date: new Date(2023, 8, 1),
  //       type: "expense" as const,
  //       merchant: "パークハイツ不動産",
  //       tags: ["固定費", "住居"],
  //     },
  //     {
  //       accountId,
  //       amount: 320000,
  //       description: "給料",
  //       category: "収入",
  //       date: new Date(2023, 8, 25),
  //       type: "income" as const,
  //       merchant: "株式会社テクノロジー",
  //       tags: ["給料", "仕事"],
  //     },
  //     {
  //       accountId,
  //       amount: -8500,
  //       description: "アマゾン",
  //       category: "ショッピング",
  //       date: new Date(2023, 8, 10),
  //       type: "expense" as const,
  //       merchant: "Amazon",
  //       tags: ["オンラインショッピング"],
  //     },
  //   ];

  //   for (const transaction of transactions) {
  //     await this.create(userId, transaction);
  //   }
  // }
}

export default new TransactionModel();
