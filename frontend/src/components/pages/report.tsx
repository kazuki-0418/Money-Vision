import { type JSX, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { loadTransactionsApi } from "../../api/transaction";
import type { Transaction } from "../../types/transaction";
import { PieChart } from "../ui/pie-chart";
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};
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
    // サイズが小さく、ナビが開いている場合は表示しない
    if (size === "small" && isNavOpen) {
      return false;
    }
    // それ以外のケースでは表示する
    return true;
  };

  return (
    <main
      className={` h-screen w-full transition-all duration-300 ${
        isNavOpen ? "lg:pl-[278px]" : "pl-0"
      }`}
    >
      {shouldShowPieChart() && <PieChart transactions={data} size={size} />}
    </main>
  );
}
