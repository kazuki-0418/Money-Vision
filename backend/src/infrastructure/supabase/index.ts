// src/services/supabase/index.ts

import { AccountService } from "./account.service";
import { TransactionService } from "./transaction.service";
import { UserService } from "./user.service";

export const SupabaseService = {
  user: UserService,
  account: AccountService,
  transaction: TransactionService,
};
