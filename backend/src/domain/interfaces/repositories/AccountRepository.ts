import { Account } from "../../entities/Account";

export interface AccountRepository {
  findById(id: string): Promise<Account | null>;
  findByUserId(userId: string): Promise<Account[]>;
  save(account: Account): Promise<Account>;
}
