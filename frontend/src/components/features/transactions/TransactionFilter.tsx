import type React from "react";
import { type JSX, useEffect, useState } from "react";
import { IoFilterOutline, IoSearchOutline } from "react-icons/io5";
import type { BankAccount } from "../../../types/account";
import type { Transaction, TransactionType } from "../../../types/transaction";
import { Input } from "../../ui/Input";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { DateRangePicker } from "../../ui/date-range-picker";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

// フィルターの型定義
interface FilterOptions {
  dateRange: { from?: Date; to?: Date };
  accountIds: string[];
  categories: string[];
  types: ("income" | "expense" | "transfer")[];
  searchQuery: string;
  minAmount?: number;
  maxAmount?: number;
}

interface TransactionFilterProps {
  accounts: BankAccount[];
  categories: { id: string; name: string }[];
  onFilterChange: (filters: FilterOptions) => void;
  transactions: Transaction[];
}

function FilterBadge({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Badge
      variant="secondary"
      className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full shadow-sm hover:bg-green-100 transition-colors"
    >
      {children}
      <button onClick={onClick} className="ml-1 text-xs">
        ×
      </button>
    </Badge>
  );
}

export function TransactionFilter({
  accounts,
  categories,
  onFilterChange,
  transactions,
}: TransactionFilterProps): JSX.Element {
  // フィルター状態の初期値
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {},
    accountIds: [],
    categories: [],
    types: [],
    searchQuery: "",
    minAmount: undefined,
    maxAmount: undefined,
  });

  // 検索クエリの更新
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // 日付範囲の更新
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    const newFilters = { ...filters, dateRange: range };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // アカウントフィルターの更新
  const handleAccountChange = (accountId: string) => {
    let newAccountIds: string[];
    if (filters.accountIds.includes(accountId)) {
      newAccountIds = filters.accountIds.filter((id) => id !== accountId);
    } else {
      newAccountIds = [...filters.accountIds, accountId];
    }

    const newFilters = { ...filters, accountIds: newAccountIds };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // カテゴリフィルターの更新
  const handleCategoryChange = (category: string) => {
    let newCategories: string[];
    if (filters.categories.includes(category)) {
      newCategories = filters.categories.filter((cat) => cat !== category);
    } else {
      newCategories = [...filters.categories, category];
    }

    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // トランザクションタイプフィルターの更新
  const handleTypeChange = (type: TransactionType) => {
    let newTypes: TransactionType[];
    if (filters.types.includes(type)) {
      newTypes = filters.types.filter((t) => t !== type);
    } else {
      newTypes = [...filters.types, type];
    }

    const newFilters = { ...filters, types: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // 金額範囲の更新
  const handleAmountChange = (type: "min" | "max", value: string) => {
    const numValue = value === "" ? undefined : Number(value);
    const newFilters = {
      ...filters,
      [type === "min" ? "minAmount" : "maxAmount"]: numValue,
    };

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // フィルタークリア
  const clearFilters = () => {
    const resetFilters: FilterOptions = {
      dateRange: {},
      accountIds: [],
      categories: [],
      types: [],
      searchQuery: "",
      minAmount: undefined,
      maxAmount: undefined,
    };

    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // アクティブなフィルターの数を計算
  const activeFilterCount = [
    filters.dateRange.from || filters.dateRange.to,
    filters.accountIds.length > 0,
    filters.categories.length > 0,
    filters.types.length > 0,
    filters.minAmount !== undefined || filters.maxAmount !== undefined,
  ].filter(Boolean).length;

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (transactions) {
      onFilterChange(filters);
    }
  }, [transactions]);

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        {/* 検索ボックス */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearchOutline className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search transactions..."
            className="pl-10"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* 日付範囲ピッカー */}
        <div className="w-full md:w-auto">
          <DateRangePicker value={filters.dateRange} onChange={handleDateRangeChange} />
        </div>

        {/* 詳細フィルターポップオーバー */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative border border-gray-300 bg-white hover:bg-gray-100 transition-colors shadow-sm flex items-center"
            >
              <IoFilterOutline className="text-gray-600" />
              <span className="font-medium">Filters</span>
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full shadow-sm hover:bg-blue-100 transition-colors"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Filter Transactions</h3>

              {/* トランザクションタイプフィルター */}
              <div>
                <h4 className="text-sm font-medium mb-2">Transaction Type</h4>
                <div className="flex flex-wrap gap-2">
                  {["income", "expense", "transfer"].map((type) => {
                    const isSelected = filters.types.includes(type as TransactionType);
                    return (
                      <button
                        key={type}
                        onClick={() => handleTypeChange(type as TransactionType)}
                        className={`
            px-2 py-1 rounded-full text-sm font-medium border transition-all duration-200
            ${
              isSelected
                ? "bg-green-800 text-white border-green-800 shadow-sm"
                : "bg-white text-green-700 border-green-300 hover:bg-gray-100"
            }
          `}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* アカウントフィルター */}
              <div>
                <h4 className="text-sm font-medium mb-2">Account</h4>
                <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
                  {accounts.map((account) => (
                    <div key={account.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`account-${account.id}`}
                        checked={filters.accountIds.includes(account.id)}
                        onChange={() => handleAccountChange(account.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`account-${account.id}`} className="text-sm cursor-pointer">
                        {account.accountName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* カテゴリフィルター */}
              <div>
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <div className="max-h-40 overflow-y-auto flex flex-col gap-1">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Amount Range</h4>
                <div className="flex gap-3">
                  <div className="relative w-1/2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount || ""}
                      onChange={(e) => handleAmountChange("min", e.target.value)}
                      className="pl-7 border-gray-300 rounded-md focus:border-gray-400 "
                    />
                  </div>
                  <div className="relative w-1/2">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount || ""}
                      onChange={(e) => handleAmountChange("max", e.target.value)}
                      className="pl-7 border-gray-300 rounded-md focus:border-gray-400 "
                    />
                  </div>
                </div>
              </div>
              {/* フィルタークリアボタン */}
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="border border-gray-300 text-gray-600 hover:text-gray-800 hover:border-gray-400"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.dateRange.from && (
            <FilterBadge
              onClick={() => handleDateRangeChange({ ...filters.dateRange, from: undefined })}
            >
              <span className="font-medium text-xs">From:</span>
              <span className="font-medium">{filters.dateRange.from.toLocaleDateString()}</span>
            </FilterBadge>
          )}

          {filters.dateRange.to && (
            <FilterBadge
              onClick={() => handleDateRangeChange({ ...filters.dateRange, to: undefined })}
            >
              <span className="font-medium text-xs">To:</span>
              <span className="font-medium">{filters.dateRange.to.toLocaleDateString()}</span>
            </FilterBadge>
          )}

          {filters.types.map((type) => (
            <FilterBadge key={type} onClick={() => handleTypeChange(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </FilterBadge>
          ))}

          {filters.accountIds.map((id) => {
            const account = accounts.find((a) => a.id === id);
            return account ? (
              <FilterBadge key={id} onClick={() => handleAccountChange(id)}>
                {account.accountName}
              </FilterBadge>
            ) : null;
          })}

          {filters.categories.map((id) => {
            const category = categories.find((c) => c.id === id);
            return category ? (
              <FilterBadge key={id} onClick={() => handleCategoryChange(id)}>
                {category.name}
              </FilterBadge>
            ) : null;
          })}

          {(filters.minAmount !== undefined || filters.maxAmount !== undefined) && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full shadow-sm hover:bg-green-100 transition-colors"
            >
              Amount:
              {filters.minAmount !== undefined ? `$${filters.minAmount}` : "$0"}
              {" - "}
              {filters.maxAmount !== undefined ? `$${filters.maxAmount}` : "∞"}
              <button
                onClick={() => {
                  const newFilters = {
                    ...filters,
                    minAmount: undefined,
                    maxAmount: undefined,
                  };
                  setFilters(newFilters);
                  onFilterChange(newFilters);
                }}
                className="ml-1 text-xs"
              >
                ×
              </button>
            </Badge>
          )}

          {activeFilterCount > 1 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-7 px-2">
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
