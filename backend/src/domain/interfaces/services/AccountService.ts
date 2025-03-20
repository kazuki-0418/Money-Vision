import { Account } from "../../entities/Account";

export interface AccountService {
  getAccountBalance(accountId: string): Promise<number>;
  getAccounts(userId: string): Promise<Account[]>;
}
