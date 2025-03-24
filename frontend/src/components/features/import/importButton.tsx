import Papa from "papaparse";
import { useRef, useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { createTransactionsApi } from "../../../api/transaction";
import type { Transaction } from "../../../types/transaction";
import { Button } from "../../ui/button";

export function ImportButton() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);

    try {
      const parsedData = await new Promise<Transaction[]>((resolve, reject) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            resolve(results.data as Transaction[]);
          },
          error: (error) => {
            reject(error);
          },
        });
      });

      const formattedData = parsedData.map((row) => ({
        accountId: row.accountId || "",
        amount: row.amount,
        type: row.type || "expense",
        description: row.description || "",
        date: row.date,
        category: row.category || "",
        merchant: row.merchant || "",
        tags:
          row.tags && typeof row.tags === "string"
            ? (row.tags as string).split(";").map((tag) => tag.trim())
            : [],
      }));

      await createTransactionsApi(formattedData);

      alert(`Successfully imported ${formattedData.length} transactions!`);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error importing transactions:", error);
      alert("Failed to import transactions. Please check your file format and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />

      <Button
        variant="outline"
        className="flex bg-white border border-gray-200 rounded-md gap-2 items-center"
        onClick={handleImportClick}
        disabled={isLoading}
      >
        <IoDownloadOutline className="h-4 text-green-950 w-4" />
        <span className="text-green-950 font-medium">{isLoading ? "Importing..." : "Import"}</span>
      </Button>
    </>
  );
}
