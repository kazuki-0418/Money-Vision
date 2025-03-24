export type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: Date;
  category: string;
  merchant?: string;
  tags?: string[];
};

export type TransactionType = "income" | "expense" | "transfer";
