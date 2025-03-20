// import * as BasicTable from "@radix-ui/themes/components/table";
import type { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  StatusBadge,
  Table,
  // Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeaderCell,
} from "../../ui/table";

export function DashboardSection(): JSX.Element {
  // Transaction data for mapping
  const transactions = [
    {
      name: "Starbucks Coffee",
      amount: 5.5,
      date: "2025/03/19",
      status: "Failed",
    },
    {
      name: "Netflix Subscription",
      amount: 15.99,
      date: "2025/03/18",
      status: "Success",
    },
    {
      name: "Amazon Order",
      amount: 42.3,
      date: "2025/03/17",
      status: "Success",
    },
    {
      name: "Apple Music",
      amount: 9.99,
      date: "2025/03/16",
      status: "Failed",
    },
    {
      name: "Uber Ride",
      amount: 22.75,
      date: "2025/03/15",
      status: "Success",
    },
    {
      name: "Grocery Store",
      amount: 67.4,
      date: "2025/03/14",
      status: "Success",
    },
    {
      name: "Gym Membership",
      amount: 45.0,
      date: "2025/03/14",
      status: "Success",
    },
    {
      name: "Electricity Bill",
      amount: 18.95,
      date: "2025/03/14",
      status: "Success",
    },
  ];

  return (
    <Card className="flex-[2] border-[#8888888a] border-[0.5px] border-solid rounded-lg overflow-hidden">
      <CardHeader className="px-6 py-4">
        <CardTitle className="text-2xl font-normal leading-6 tracking-[-0.14px]">
          Recent Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table maxHeight="252px">
          <TableHeader>
            <TableRow>
              <TableHead style={{ width: "40%" }}>Name</TableHead>
              <TableHead style={{ width: "20%" }}>Amount</TableHead>
              <TableHead style={{ width: "20%" }}>Date</TableHead>
              <TableHead style={{ width: "20%", textAlign: "center" }}>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.name + transaction.date}>
                <TableRowHeaderCell style={{ width: "40%" }}>{transaction.name}</TableRowHeaderCell>
                <TableCell style={{ width: "20%" }}>{transaction.amount}</TableCell>
                <TableCell style={{ width: "20%" }}>{transaction.date}</TableCell>
                <TableCell style={{ width: "20%", textAlign: "center" }}>
                  <StatusBadge status={transaction.status as "Failed" | "Success"} />
                </TableCell>
              </TableRow>
            ))}
            <tr className="border-none h-[27px]" />
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
