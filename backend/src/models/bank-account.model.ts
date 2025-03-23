import { SupabaseService } from "../infrastructure/supabase";
import { BankAccount, BankAccountCreate, BankAccountUpdate } from "../types/accounts";

class BankAccountModel {
  private accountService;

  constructor() {
    const { account } = SupabaseService;
    this.accountService = account;
  }

  // 指定したユーザーIDに紐づく銀行口座一覧を取得
  async loadUserBankAccounts(userId: string): Promise<BankAccount[]> {
    return await this.accountService.getBankAccounts(userId);
  }

  // 特定の銀行口座IDから口座を取得
  async getBankAccountById(id: string): Promise<BankAccount | null> {
    return await this.accountService.getBankAccount(id);
  }

  // 新しい銀行口座を作成
  async create(accountData: BankAccount): Promise<BankAccount | null> {
    const newAccount: BankAccountCreate = {
      userId: accountData.userId,
      accountNumber: accountData.accountNumber,
      accountName: accountData.accountName,
      balance: accountData.balance || 0,
      currency: accountData.currency,
      type: accountData.type,
    };

    return await this.accountService.createBankAccount(newAccount);
  }

  // 銀行口座情報を更新
  async update(id: string, accountData: BankAccountUpdate): Promise<BankAccount | null> {
    const account = await this.getBankAccountById(id);
    if (!account) {
      return null;
    }

    const updatedAccount: BankAccount = {
      ...account,
      ...accountData,
    };

    return await this.accountService.updateBankAccount(id, updatedAccount);
  }

  // 銀行口座を削除
  async delete(id: string): Promise<boolean> {
    return await this.accountService.deleteBankAccount(id);
  }
}

export default new BankAccountModel();
