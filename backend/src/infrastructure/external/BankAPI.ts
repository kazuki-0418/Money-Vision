import { Transaction } from "../../domain/entities/Transaction";
import env from "../config/env";

export class BankAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = env.bankApiUrl;
    this.apiKey = env.bankApiKey;
  }

  // モック関数：実際には外部APIにリクエストを送ります
  async getAccountBalance(accountId: string): Promise<number> {
    // 銀行APIのモックデータ
    console.log(`Fetching balance for account ${accountId} from bank API`);

    // 実際の実装では、以下のようなAPIリクエストを行います
    // const response = await fetch(`${this.baseUrl}/accounts/${accountId}/balance`, {
    //   headers: {
    //     'Authorization': `Bearer ${this.apiKey}`
    //   }
    // });
    // const data = await response.json();
    // return data.balance;

    // モックデータを返す
    return Math.random() * 10000;
  }

  async getTransactions(accountId: string): Promise<Transaction[]> {
    // 銀行APIのモックデータ
    console.log(`Fetching transactions for account ${accountId} from bank API`);

    // 実際の実装では外部APIリクエストを行います
    // モックデータを返す
    const mockTransactions: Transaction[] = [];
    const merchants = ["Starbucks", "Amazon", "Netflix", "Grocery Store", "Gas Station"];
    const types = ["debit", "credit"];
    const statuses = ["completed", "pending"];

    for (let i = 0; i < 10; i++) {
      mockTransactions.push({
        id: `trans_${Math.random().toString(36).substring(2, 10)}`,
        accountId,
        amount: Math.random() * 200,
        currency: "USD",
        description: `Transaction #${i + 1}`,
        merchant: merchants[Math.floor(Math.random() * merchants.length)],
        type: types[Math.floor(Math.random() * types.length)] as "debit" | "credit",
        status: statuses[Math.floor(Math.random() * statuses.length)] as
          | "failed"
          | "completed"
          | "pending",
        date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
      });
    }

    return mockTransactions;
  }
}
