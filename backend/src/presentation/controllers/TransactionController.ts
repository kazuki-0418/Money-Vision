import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { TransactionService } from "../../application/services/TransactionService";
import { Transaction } from "../../domain/entities/Transaction";
import { BankAPI } from "../../infrastructure/external/BankAPI";
import { SupabaseTransactionRepository } from "../../infrastructure/repositories/SupabaseTransactionRepository";

export class TransactionController {
  private transactionService: TransactionService;
  private bankApi: BankAPI;
  private transactionRepository: SupabaseTransactionRepository;

  constructor() {
    this.transactionRepository = new SupabaseTransactionRepository();
    this.transactionService = new TransactionService(this.transactionRepository);
    this.bankApi = new BankAPI();
  }

  async getTransactionHistory(req: Request, res: Response): Promise<void> {
    try {
      const { accountId } = req.params;

      // 銀行APIからトランザクション履歴を取得
      const apiTransactions = await this.bankApi.getTransactions(accountId);

      // Supabaseに保存
      const savedTransactions: Transaction[] = [];
      for (const transaction of apiTransactions) {
        // DBに存在するか確認する代わりに、常に新規トランザクションとして保存
        // 実際のアプリケーションでは重複チェックが必要

        const newTransaction = {
          id: transaction.id || uuidv4(),
          accountId,
          amount: transaction.amount,
          currency: transaction.currency,
          description: transaction.description,
          merchant: transaction.merchant,
          type: transaction.type,
          status: transaction.status,
          date: new Date(transaction.date),
          createdAt: new Date(),
        };

        const saved = await this.transactionRepository.save(newTransaction);
        savedTransactions.push(saved);
      }

      // 保存されたトランザクションを取得して返す
      const transactions = await this.transactionService.getTransactionHistory(accountId);

      res.status(200).json(
        transactions.map((transaction) => ({
          id: transaction.id,
          amount: transaction.amount,
          currency: transaction.currency,
          description: transaction.description,
          merchant: transaction.merchant,
          type: transaction.type,
          status: transaction.status,
          date: transaction.date.toISOString(),
        })),
      );
    } catch (error) {
      console.error("Error in getTransactionHistory:", error);
      res.status(500).json({ error: "Failed to get transaction history" });
    }
  }
}
