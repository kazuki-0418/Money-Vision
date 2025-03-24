import { type JSX, useEffect, useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { useOutletContext } from "react-router-dom";
import { loadAccountsApi } from "../../api/account";
import {
  createTransactionApi,
  deleteTransactionApi,
  loadTransactionsApi,
  updateTransactionApi,
} from "../../api/transaction";
import { Button } from "../../components/ui/button";
import { Modal } from "../../components/ui/modal";
import { categories } from "../../const/mockData";
import type { BankAccount } from "../../types/account";
import type { Transaction as TransactionData } from "../../types/transaction";
import { ImportButton } from "../features/import/importButton";
import { TransactionFilter } from "../features/transactions/TransactionFilter";
import { TransactionForm } from "../features/transactions/TransactionForm";
import { TransactionTable } from "../features/transactions/TransactionTable";

type FilterOptions = {
  dateRange: { from?: Date; to?: Date };
  accountIds: string[];
  categories: string[];
  types: ("income" | "expense" | "transfer")[];
  searchQuery: string;
  minAmount?: number;
  maxAmount?: number;
};

export function TransactionPage(): JSX.Element {
  const { isNavOpen } = useOutletContext<{ isNavOpen: boolean }>();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionData[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  const handleFilterChange = (filters: FilterOptions) => {
    const filtered = transactions.filter((transaction) => {
      if (
        filters.searchQuery &&
        !transaction.description.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (filters.dateRange.from && new Date(transaction.date) < filters.dateRange.from) {
        return false;
      }

      if (filters.dateRange.to && new Date(transaction.date) > filters.dateRange.to) {
        return false;
      }

      if (filters.accountIds.length && !filters.accountIds.includes(transaction.accountId)) {
        return false;
      }

      if (filters.categories.length && !filters.categories.includes(transaction.category)) {
        return false;
      }

      if (filters.types.length && !filters.types.includes(transaction.type)) {
        return false;
      }

      if (filters.minAmount && transaction.amount < filters.minAmount) {
        return false;
      }

      if (filters.maxAmount && transaction.amount > filters.maxAmount) {
        return false;
      }

      return true;
    });
    setFilteredTransactions(filtered);
  };

  const handleEdit = (transaction: TransactionData) => {
    setEditingTransaction(transaction);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const canDelete = window.confirm("Are you sure you want to delete this transaction?");
    if (!canDelete) return;

    const res = await deleteTransactionApi(id);
    setTransactions(res);
    setFilteredTransactions(res);
    window.alert("Transaction deleted successfully!");
    window.location.reload();
  };

  const handleFormSubmit = async (transactionData: Omit<TransactionData, "id">) => {
    try {
      if (editingTransaction) {
        await updateTransactionApi(editingTransaction.id, {
          accountId: transactionData.accountId,
          amount: transactionData.amount,
          category: transactionData.category,
          merchant: transactionData.merchant,
          tags: transactionData.tags,
          type: transactionData.type,
          description: transactionData.description,
          date: transactionData.date.toISOString(),
        });

        const updatedTransactions = await loadTransactionsApi();
        setTransactions(updatedTransactions);
        setFilteredTransactions(updatedTransactions);
        window.alert("Transaction updated successfully!");
      } else {
        await createTransactionApi({
          accountId: transactionData.accountId,
          amount: transactionData.amount,
          category: transactionData.category,
          merchant: transactionData.merchant,
          tags: transactionData.tags,
          type: transactionData.type,
          description: transactionData.description,
          date: transactionData.date.toISOString(),
        });

        const newTransactions = await loadTransactionsApi();
        setTransactions(newTransactions);
        setFilteredTransactions(newTransactions);
        window.alert("Transaction created successfully!");
      }

      setIsFormModalOpen(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Transaction operation failed:", error);
      window.alert("エラーが発生しました。もう一度お試しください。");
    }
  };

  const handleCloseModal = () => {
    setIsFormModalOpen(false);
    setEditingTransaction(null);
  };

  useEffect(() => {
    loadAccountsApi().then((response) => {
      setAccounts(response);
    });

    loadTransactionsApi({
      limit: 100,
      offset: 0,
    }).then((response) => {
      setTransactions(response);
      setFilteredTransactions(response);
    });
  }, []);

  return (
    <main className="flex bg-[#f8f8f8] h-screen w-full">
      <div
        className={`flex-1 h-screen w-full transition-all duration-300 ${
          isNavOpen ? "lg:pl-[278px]" : "pl-0"
        }`}
      >
        <div className="flex flex-col h-full p-6 gap-6 overflow-y-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Transactions</h1>
            <ImportButton />
          </div>

          <TransactionFilter
            accounts={accounts}
            categories={categories}
            onFilterChange={handleFilterChange}
            transactions={transactions}
          />

          <div className="flex justify-end">
            <Button
              onClick={() => setIsFormModalOpen(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 hover:shadow-md cursor-pointer"
            >
              <IoAddOutline className="h-5 w-5" />
              New Transaction
            </Button>
          </div>

          <div className="flex gap-6 overflow-auto">
            <TransactionTable
              transactions={filteredTransactions}
              accounts={accounts}
              categories={categories}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseModal}
        title={editingTransaction ? "Edit Transaction" : "New Transaction"}
        className="w-full max-w-md"
      >
        <TransactionForm
          accounts={accounts}
          onSubmit={handleFormSubmit}
          initialData={editingTransaction || undefined}
        />
      </Modal>
    </main>
  );
}
