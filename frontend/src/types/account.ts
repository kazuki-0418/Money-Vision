export type BankAccount = {
  id: string;
  userId: string;
  accountNumber: string;
  accountName: string;
  balance: number;
  currency: string;
  type: "checking" | "savings" | "credit";
  createdAt: Date;
  updatedAt: Date;
};

export type BankAccountCreate = Omit<BankAccount, "id" | "createdAt" | "updatedAt">;
export type BankAccountUpdate = Omit<BankAccount, "id" | "userId" | "createdAt" | "updatedAt">;
