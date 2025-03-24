import { format } from "date-fns";
import type { JSX } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import type { BankAccount } from "../../../types/account";
import { Button } from "../../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";

interface Transaction {
  id: string;
  accountId: string;
  amount: number;
  description: string;
  category: string;
  date: Date;
  type: "income" | "expense" | "transfer";
  merchant?: string;
  tags?: string[];
}

interface TransactionTableProps {
  transactions: Transaction[];
  accounts: BankAccount[];
  categories: { id: string; name: string }[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

export function TransactionTable({
  transactions,
  accounts,
  categories,
  onEdit,
  onDelete,
}: TransactionTableProps): JSX.Element {
  const getAccountName = (accountId: string) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? account.accountName : "Unknown Account";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

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

  return (
    <div className="w-full overflow-auto">
      <div className="hidden xl:block">
        <Table maxHeight="600px">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="hidden lg:table-cell">Merchant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(new Date(transaction.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className={getTypeColor(transaction.type)}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </TableCell>
                  <TableCell>{getAccountName(transaction.accountId)}</TableCell>
                  <TableCell>{getCategoryName(transaction.category)}</TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {transaction.description}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {transaction.merchant || "—"}
                  </TableCell>
                  <TableCell className={getTypeColor(transaction.type)}>
                    {formatAmount(transaction.amount, transaction.type)}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {transaction.tags && transaction.tags.length > 0 ? (
                        transaction.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {onEdit && (
                        <Button
                          size={"icon"}
                          className="text-indigo-500 border-0 shadow-none"
                          onClick={() => onEdit(transaction)}
                        >
                          <FiEdit2 />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size={"icon"}
                          className="text-red-500 border-0 shadow-none"
                          onClick={() => onDelete(transaction.id)}
                        >
                          <IoTrashOutline />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* モバイル表示用カード */}
      <div className="xl:hidden space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-lg shadow p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-lg">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </p>
                </div>
                <p className={`font-medium ${getTypeColor(transaction.type)}`}>
                  {formatAmount(transaction.amount, transaction.type)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">Type</p>
                  <p className={getTypeColor(transaction.type)}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Account</p>
                  <p>{getAccountName(transaction.accountId)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{getCategoryName(transaction.category)}</p>
                </div>
                {transaction.merchant && (
                  <div>
                    <p className="text-gray-500">Merchant</p>
                    <p>{transaction.merchant}</p>
                  </div>
                )}
              </div>

              {transaction.tags && transaction.tags.length > 0 && (
                <div className="mb-3">
                  <p className="text-gray-500 text-sm mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {transaction.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 border-t pt-3 mt-2">
                {onEdit && (
                  <Button
                    size={"icon"}
                    className="text-indigo-500 border-0 shadow-none hover:bg-indigo-50"
                    onClick={() => onEdit(transaction)}
                  >
                    <FiEdit2 />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    size={"icon"}
                    className="text-red-500 border-0 shadow-none hover:bg-red-50"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <IoTrashOutline />
                  </Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
