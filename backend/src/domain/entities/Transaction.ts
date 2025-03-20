export type Transaction = {
  id: string;
  accountId: string;
  amount: number;
  currency: string;
  description: string;
  merchant: string;
  type: "debit" | "credit";
  status: "pending" | "completed" | "failed";
  date: Date;
  createdAt: Date;
};
