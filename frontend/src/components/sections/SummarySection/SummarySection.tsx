import { ArrowUpIcon } from "@radix-ui/react-icons";
import type { JSX } from "react";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";

// Define card data for mapping
const summaryCards = [
  {
    title: "Total Balance",
    amount: "$25,250.05",
    percentChange: "+20%",
    icon: "/attachmoneyoutlined.svg",
    iconAlt: "Attach money",
  },
  {
    title: "Budget",
    amount: "$20,322.05",
    percentChange: "+20%",
    icon: "/savingsoutlined.svg",
    iconAlt: "Savings outlined",
  },
  {
    title: "Expends",
    amount: "$4500,00",
    percentChange: "+20%",
    icon: "/creditscoreoutlined.svg",
    iconAlt: "Credit score",
  },
  {
    title: "Income",
    amount: "$25,250.05",
    percentChange: "+20%",
    icon: "/addcardoutlined.svg",
    iconAlt: "Add card outlined",
  },
];

export function SummarySection(): JSX.Element {
  return (
    <div className="grid grid-cols-2 w-full gap-6">
      {summaryCards.map((card) => (
        <Card
          key={card.iconAlt}
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
                {card.amount}
              </p>
            </div>

            <div className="absolute bottom-[43px] right-4">
              <img className="h-20 w-20" alt={card.iconAlt} src={card.icon} />
            </div>

            <div className="flex absolute bottom-4 gap-4 items-center left-4">
              <Badge className="flex bg-[#a1e66d] h-7 rounded-md text-[#204f4c] items-center px-4 py-2">
                <ArrowUpIcon className="h-4 w-4 mr-1" />
                <span className="text-[#204f4c] font-body-medium">{card.percentChange}</span>
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
