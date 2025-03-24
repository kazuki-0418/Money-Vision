import { type JSX, useEffect, useState } from "react";
import { loadTransactionsApi } from "../../../api/transaction";
import type { Transaction } from "../../../types/transaction";
import NewsApp from "../../features/news/news-app";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { PieChart } from "../../ui/pie-chart";

export function ReportSection(): JSX.Element {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    loadTransactionsApi({
      limit: 100,
      offset: 0,
    }).then((response) => {
      setData(response);
    });
  }, []);

  return (
    <div className="flex flex-auto flex-col h-full gap-6">
      <NewsApp />

      <Card className="flex-1 border-[#88888888] border-[0.5px] overflow-hidden">
        <CardHeader className="bg-white p-4">
          <CardTitle className="text-xl font-medium leading-[22px]">Report</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-64px)] p-0">
          <PieChart transactions={data} size="small" />
        </CardContent>
      </Card>
    </div>
  );
}
