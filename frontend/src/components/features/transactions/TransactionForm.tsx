import * as Form from "@radix-ui/react-form";
import * as Tabs from "@radix-ui/react-tabs";
import { format } from "date-fns";
import type React from "react";
import { type JSX, useState } from "react";
import { availableTags, categories } from "../../../const/mockData";
import type { BankAccount } from "../../../types/account";
import type { Transaction } from "../../../types/transaction";
import { Button } from "../../ui/button";
import { Select } from "../../ui/select";

interface TransactionFormProps {
  accounts: BankAccount[];
  onSubmit: (transaction: Omit<Transaction, "id">) => void;
  initialData?: Partial<Transaction>;
}

export function TransactionForm({
  accounts,
  onSubmit,
  initialData,
}: TransactionFormProps): JSX.Element {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    accountId: initialData?.accountId || "",
    amount: initialData?.amount || 0,
    description: initialData?.description || "",
    category: initialData?.category || "",
    date: initialData?.date || new Date(),
    type: initialData?.type || "expense",
    merchant: initialData?.merchant || "",
    tags: [],
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type: "income" | "expense" | "transfer") => {
    setFormData((prev) => ({ ...prev, type }));
  };

  const handleTagToggle = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Include tags in the final form data
    const finalData = {
      ...formData,
      amount: Number(formData.amount),
      date: formData.date || new Date(),
      tags: selectedTags,
    } as Omit<Transaction, "id">;

    onSubmit(finalData);

    // Reset the form
    setFormData({
      accountId: "",
      amount: 0,
      description: "",
      category: "",
      date: new Date(),
      type: "expense",
      merchant: "",
    });
    setSelectedTags([]);
  };
  return (
    <Form.Root className="w-full bg-white" onSubmit={handleSubmit}>
      <Tabs.Root
        defaultValue={formData.type}
        className="mb-4"
        onValueChange={(value) => handleTypeChange(value as "income" | "expense" | "transfer")}
      >
        <Tabs.List className="flex border-b">
          <Tabs.Trigger
            value="expense"
            className="flex-1 p-2 text-center border-b-2 border-gray-200 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600"
          >
            Expense
          </Tabs.Trigger>
          <Tabs.Trigger
            value="income"
            className="flex-1 p-2 text-center border-b-2 border-gray-200 border-transparent data-[state=active]:border-green-500 data-[state=active]:text-green-600"
          >
            Income
          </Tabs.Trigger>
          <Tabs.Trigger
            value="transfer"
            className="flex-1 p-2 text-center border-b-2 border-gray-200 border-transparent data-[state=active]:border-purple-500 data-[state=active]:text-purple-600"
          >
            Transfer
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      <div className="mb-4">
        <Select
          label="Account"
          name="accountId"
          options={accounts.map((account) => ({ id: account.id, name: account.accountName }))}
          value={formData.accountId || ""}
          onChange={handleSelectChange}
          placeholder="Select an account"
          errorMessage="Please select an account"
          required
        />
      </div>

      <div className="mb-4">
        <Form.Field name="amount">
          <div className="flex items-baseline justify-between">
            <Form.Label className="text-sm font-medium">Amount</Form.Label>
            <Form.Message className="text-xs text-red-500" match="valueMissing">
              Please enter an amount
            </Form.Message>
            <Form.Message className="text-xs text-red-500" match="typeMismatch">
              Please enter a valid number
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="number"
              className="w-full border rounded px-3 py-2 border-gray-300"
              required
              name="amount"
              value={formData.amount || ""}
              onChange={handleChange}
            />
          </Form.Control>
        </Form.Field>
      </div>

      <div className="mb-4">
        <Form.Field name="description">
          <div className="flex items-baseline justify-between">
            <Form.Label className="text-sm font-medium">Description</Form.Label>
          </div>
          <Form.Control asChild>
            <input
              type="text"
              className="w-full border rounded px-3 py-2  border-gray-300"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </Form.Control>
        </Form.Field>
      </div>

      <div className="mb-4">
        <Select
          label="Category"
          name="category"
          options={categories}
          value={formData.category || ""}
          onChange={handleSelectChange}
          placeholder="Select a category"
          className="mt-4"
        />
      </div>

      <div className="mb-4">
        <Form.Field name="date">
          <div className="flex items-baseline justify-between">
            <Form.Label className="text-sm font-medium">Date</Form.Label>
          </div>
          <Form.Control asChild>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 border-gray-300 "
              name="date"
              value={formData.date ? format(new Date(formData.date), "yyyy-MM-dd") : ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  date: e.target.value ? new Date(e.target.value) : new Date(),
                }))
              }
            />
          </Form.Control>
        </Form.Field>
      </div>

      <div className="mb-4">
        <Form.Field name="merchant">
          <div className="flex items-baseline justify-between">
            <Form.Label className="text-sm font-medium">Merchant/Payee</Form.Label>
          </div>
          <Form.Control asChild>
            <input
              className="w-full border rounded px-3 py-2 border-gray-300"
              name="merchant"
              value={formData.merchant || ""}
              onChange={handleChange}
            />
          </Form.Control>
        </Form.Field>
      </div>

      <div className="mb-6">
        <label htmlFor="tags" className="text-sm font-medium block mb-2">
          Tags
        </label>
        <div id="tags" className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Button
              key={tag}
              onClick={(e) => handleTagToggle(tag, e)}
              size={"sm"}
              className={`${
                selectedTags.includes(tag)
                  ? "bg-green-100 text-green-800 border-green-300"
                  : "bg-gray-100 text-gray-800 border-gray-200"
              } border rounded-full px-2 py-1 text-sm`}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <Form.Submit asChild>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          {initialData ? "Update" : "Save"}
        </button>
      </Form.Submit>
    </Form.Root>
  );
}
