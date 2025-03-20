import { Transaction } from "../../entities/Transaction";

export interface TransactionService {
  getTransactionHistory(accountId: string): Promise<Transaction[]>;
}
