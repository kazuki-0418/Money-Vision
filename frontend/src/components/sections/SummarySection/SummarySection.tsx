import { type JSX, useEffect, useState } from "react";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { loadAccountsApi } from "../../../api/account";
import { loadTransactionsApi } from "../../../api/transaction";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";

const summaryCards = {
  balance: {
    title: "Total Balance",
    amount: 0,
    percentChange: 0,
    icon: "/attachmoneyoutlined.svg",
    iconAlt: "Attach money",
  },
  budget: {
    title: "Budget",
    amount: 3000,
    percentChange: 0,
    icon: "/savingsoutlined.svg",
    iconAlt: "Savings outlined",
  },
  expends: {
    title: "Expends",
    amount: 0,
    percentChange: 0,
    icon: "/creditscoreoutlined.svg",
    iconAlt: "Credit score",
  },
  income: {
    title: "Income",
    amount: 0,
    percentChange: 0,
    icon: "/addcardoutlined.svg",
    iconAlt: "Add card outlined",
  },
};

export function SummarySection(): JSX.Element {
  const [data, setData] = useState<{
    balance: {
      title: string;
      amount: number;
      percentChange: number;
      icon: string;
      iconAlt: string;
    };
    budget: { title: string; amount: number; percentChange: number; icon: string; iconAlt: string };
    expends: {
      title: string;
      amount: number;
      percentChange: number;
      icon: string;
      iconAlt: string;
    };
    income: { title: string; amount: number; percentChange: number; icon: string; iconAlt: string };
  }>(summaryCards);

  useEffect(() => {
    const initSummarySection = async () => {
      try {
        const localSummaryCards = {
          balance: { ...summaryCards.balance, amount: 0 },
          budget: { ...summaryCards.budget, amount: 3000 },
          expends: { ...summaryCards.expends, amount: 0 },
          income: { ...summaryCards.income, amount: 0 },
        };

        const [accounts, transactions] = await Promise.all([
          loadAccountsApi(),
          loadTransactionsApi({ limit: 100, offset: 0 }),
        ]);

        for (const account of accounts) {
          localSummaryCards.balance.amount += account.balance;
        }

        await Promise.all(
          transactions.map(async (transaction) => {
            switch (transaction.type) {
              case "income":
                localSummaryCards.income.amount += transaction.amount;
                localSummaryCards.balance.amount += transaction.amount;
                break;
              case "expense":
              case "transfer":
                localSummaryCards.expends.amount += transaction.amount;
                localSummaryCards.budget.amount -= transaction.amount;
                localSummaryCards.balance.amount -= transaction.amount;
                break;
              default:
                console.info("Unknown transaction type: ", transaction.type);
            }
          }),
        );

        localSummaryCards.income.percentChange = Number(
          ((localSummaryCards.income.amount / localSummaryCards.budget.amount) * 100).toFixed(2),
        );

        localSummaryCards.expends.percentChange = Number(
          ((localSummaryCards.expends.amount / localSummaryCards.budget.amount) * 100).toFixed(2),
        );

        localSummaryCards.balance.percentChange = Number(
          ((localSummaryCards.balance.amount / localSummaryCards.budget.amount) * 100).toFixed(2),
        );

        const initialBudget = 3000;
        const spentBudget = initialBudget - localSummaryCards.budget.amount;
        localSummaryCards.budget.percentChange = Number(
          ((spentBudget / initialBudget) * 100).toFixed(2),
        );

        setData(localSummaryCards);
      } catch (error) {
        console.error("Failed to load summary data:", error);
      }
    };
    initSummarySection();
  }, []);

  return (
    <div className="grid grid-cols-2 w-full gap-6">
      {Object.entries(data).map(([key, card]) => (
        <Card
          key={card.title + key}
          className="h-[200px] rounded-2xl shadow-[0px_3px_3px_#00000040] overflow-hidden relative"
        >
          <CardContent className="p-6">
            <div className="mb-3">
              <h3 className="[font-family:'Space_Grotesk',Helvetica] font-medium text-black text-xs tracking-[-0.12px]">
                {card.title}
              </h3>
            </div>

            <div className="mb-6">
              <p className="[font-family:'Space_Grotesk',Helvetica] font-bold text-black text-lg tracking-[-0.18px]">
                $
                {card.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <div className="absolute bottom-[43px] right-4">
              <img className="h-20 w-20" alt={card.iconAlt} src={card.icon} />
            </div>

            <div className="flex absolute bottom-4 gap-4 items-center left-4">
              <Badge
                className={`flex h-7 rounded-md items-center px-4 py-2 ${
                  card.percentChange < 0
                    ? "bg-[#ff6b6b] text-[#6e1c1c]" // マイナスの場合は赤色系
                    : "bg-[#a1e66d] text-[#204f4c]" // プラスまたは0の場合は緑色系
                }`}
              >
                {card.percentChange < 0 ? (
                  <IoArrowDown className="h-4 w-4 mr-1" />
                ) : (
                  <IoArrowUp className="h-4 w-4 mr-1" />
                )}
                <span className={card.percentChange < 0 ? "text-[#6e1c1c]" : "text-[#204f4c]"}>
                  {Math.abs(card.percentChange ?? 0)}%
                </span>
              </Badge>

              <span className="[font-family:'Space_Grotesk',Helvetica] font-medium text-black text-xs tracking-[-0.12px]">
                than last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
