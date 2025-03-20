import { Request, Response } from "express";
import { AccountService } from "../../application/services/AccountService";
import { BankAPI } from "../../infrastructure/external/BankAPI";
import { SupabaseAccountRepository } from "../../infrastructure/repositories/SupabaseAccountRepository";

export class AccountController {
  private accountService: AccountService;
  private bankApi: BankAPI;
  private accountRepository: SupabaseAccountRepository;

  constructor() {
    this.accountRepository = new SupabaseAccountRepository();
    this.accountService = new AccountService(this.accountRepository);
    this.bankApi = new BankAPI();
  }

  async getAccountBalance(req: Request, res: Response): Promise<void> {
    try {
      const { accountId } = req.params;

      // 銀行APIから残高を取得
      const balance = await this.bankApi.getAccountBalance(accountId);

      // Supabaseに保存されているアカウントを取得
      let account = await this.accountRepository.findById(accountId);

      if (account) {
        // 既存のアカウントを更新
        account = await this.accountRepository.save({
          ...account,
          balance,
          updatedAt: new Date(),
        });
      } else {
        // 新しいアカウントを作成
        account = await this.accountRepository.save({
          id: accountId,
          userId: req.body.userId || "default-user",
          accountNumber: `ACC-${Math.floor(Math.random() * 1000000)}`,
          balance,
          currency: "USD",
          type: "checking",
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      res.status(200).json({
        id: account.id,
        accountNumber: account.accountNumber,
        balance: account.balance,
        currency: account.currency,
      });
    } catch (error) {
      console.error("Error in getAccountBalance:", error);
      res.status(500).json({ error: "Failed to get account balance" });
    }
  }

  async getUserAccounts(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const accounts = await this.accountService.getAccounts(userId);

      res.status(200).json(
        accounts.map((account) => ({
          id: account.id,
          accountNumber: account.accountNumber,
          balance: account.balance,
          currency: account.currency,
          type: account.type,
        })),
      );
    } catch (error) {
      console.error("Error in getUserAccounts:", error);
      res.status(500).json({ error: "Failed to get user accounts" });
    }
  }
}
