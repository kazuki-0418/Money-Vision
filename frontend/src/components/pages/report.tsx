import { type JSX, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { loadTransactionsApi } from "../../api/transaction";
import { useWindowSize } from "../../hooks/windowsize";
import type { Transaction } from "../../types/transaction";
import { PieChart } from "../ui/pie-chart";

export function Report(): JSX.Element {
  const { isNavOpen } = useOutletContext<{ isNavOpen: boolean }>();
  const [data, setData] = useState<Transaction[]>([]);
  const { width } = useWindowSize();
  const size = width > 1024 ? "large" : "small";

  useEffect(() => {
    loadTransactionsApi({
      limit: 100,
      offset: 0,
    }).then((response) => {
      setData(response);
    });
  }, []);

  const shouldShowPieChart = () => {
    if (size === "small" && isNavOpen) {
      return false;
    }
    return true;
  };

  return (
    <main
      className={` h-screen w-full transition-all duration-300 ${
        isNavOpen ? "lg:pl-[278px]" : "pl-0"
      }`}
    >
      {shouldShowPieChart() && (
        <PieChart transactions={data} size={size} align={size === "small" ? "center" : "right"} />
      )}
    </main>
  );
}
