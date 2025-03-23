export type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense" | "transfer";
  merchant?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type TransactionCreate = Omit<Transaction, "id" | "createdAt" | "updatedAt">;
export type TransactionUpdate = Omit<Transaction, "id" | "accountId" | "createdAt" | "updatedAt">;
