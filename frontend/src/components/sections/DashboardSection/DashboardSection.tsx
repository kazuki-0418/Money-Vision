import { format } from "date-fns";
import { type JSX, useEffect, useState } from "react";
import { loadTransactionsApi } from "../../../api/transaction";
import type { TransactionType } from "../../../types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  // Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeaderCell,
} from "../../ui/table";

type Transaction = {
  name: string;
  amount: number;
  date: Date;
  type: TransactionType;
};

export function DashboardSection(): JSX.Element {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const getTypeColor = (type: "income" | "expense" | "transfer") => {
    switch (type) {
      case "income":
        return "text-green-600";
      case "expense":
        return "text-blue-600";
      case "transfer":
        return "text-purple-600";
      default:
        return "";
    }
  };

  const formatAmount = (amount: number, type: "income" | "expense" | "transfer") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.abs(amount));

    if (type === "expense") {
      return `-${formatted}`;
    }
    return formatted;
  };

  useEffect(() => {
    loadTransactionsApi({
      limit: 30,
      offset: 0,
    }).then((response) => {
      const mappedTransactions = response.map((transaction) => ({
        name: transaction.merchant || transaction.description,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
      }));

      setTransactions(mappedTransactions);
    });
  }, []);

  return (
    <Card className="flex-[2] border-[#8888888a] border-[0.5px] border-solid rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-2xl font-normal leading-6 tracking-[-0.14px]">
          Recent Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table maxHeight="400px">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "20%" }}>Date</TableHead>

              <TableHead style={{ width: "40%" }}>Name</TableHead>
              <TableHead style={{ width: "20%" }}>Amount</TableHead>
              <TableHead style={{ width: "20%" }}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.name + transaction.date}>
                <TableCell style={{ width: "20%" }}>
                  {format(new Date(transaction.date), "dd/MM/yyyy")}
                </TableCell>
                <TableRowHeaderCell style={{ width: "40%" }}>{transaction.name}</TableRowHeaderCell>
                <TableCell className={getTypeColor(transaction.type)}>
                  {formatAmount(transaction.amount, transaction.type)}
                </TableCell>
                <TableCell className={getTypeColor(transaction.type)}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
