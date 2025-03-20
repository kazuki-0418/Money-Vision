import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/interfaces/repositories/TransactionRepository";
import { TransactionService as ITransactionService } from "../../domain/interfaces/services/TransactionService";

export class TransactionService implements ITransactionService {
  constructor(private transactionRepository: TransactionRepository) {}

  async getTransactionHistory(accountId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByAccountId(accountId);
  }
}
