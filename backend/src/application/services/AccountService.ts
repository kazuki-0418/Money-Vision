import { Account } from "../../domain/entities/Account";
import { AccountRepository } from "../../domain/interfaces/repositories/AccountRepository";
import { AccountService as IAccountService } from "../../domain/interfaces/services/AccountService";

export class AccountService implements IAccountService {
  constructor(private accountRepository: AccountRepository) {}

  async getAccountBalance(accountId: string): Promise<number> {
    const account = await this.accountRepository.findById(accountId);
    if (!account) {
      throw new Error(`Account not found: ${accountId}`);
    }
    return account.balance;
  }

  async getAccounts(userId: string): Promise<Account[]> {
    return this.accountRepository.findByUserId(userId);
  }
}
