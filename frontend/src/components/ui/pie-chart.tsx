import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { Transaction } from "../../types/transaction";

const createPieChartData = (transactions: Transaction[], type = "expense") => {
  const filteredTransactions = transactions.filter((t) => t.type === type);

  const categoryTotals: { [key: string]: number } = {};

  for (const transaction of filteredTransactions) {
    const category = transaction.category || "ncategorized";
    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }
    categoryTotals[category] += Math.abs(transaction.amount);
  }

  const pieData = Object.keys(categoryTotals).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));

  return pieData;
};

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A4DE6C",
  "#8884D8",
  "#82CA9D",
  "#F5A623",
  "#D0021B",
  "#9013FE",
];

type Props = {
  transactions: Transaction[];
  size: "small" | "large";
  align: "center" | "right";
};

export function PieChart({ transactions, size, align }: Props) {
  const expensePieData = createPieChartData(transactions, "expense");
  const incomePieData = createPieChartData(transactions, "income");

  const formatAmount = (value: number) => {
    if (typeof value !== "number") return "$0.00";
    return `$${Math.abs(value).toFixed(2)}`;
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    if (percent === 0) return null;

    const RADIAN = Math.PI / 180;
    const radius = 25 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  function CustomTooltip({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: {
      name?: string;
      value?: number;
    }[];
  }) {
    if (active && payload && payload.length && payload[0].value) {
      return (
        <div className="bg-white p-2 shadow rounded">
          <p className="font-semibold">{payload[0].name}</p>
          <p>{formatAmount(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  }

  const legendFormatter = (
    value: string,
    entry: {
      payload?: { value: number };
    },
  ) => {
    if (!entry || !entry.payload) return value;
    return (
      <span className="text-sm">
        {value}: {formatAmount(entry.payload.value)}
      </span>
    );
  };

  const totalExpense = expensePieData.reduce((sum, item) => sum + item.value, 0);
  const totalIncome = incomePieData.reduce((sum, item) => sum + item.value, 0);
  const chartConfig = {
    width: size === "small" ? 500 : 1200,
    height: size === "small" ? 300 : 500,
    outerRadius: size === "small" ? 80 : 150,
    containerClass: `${size === "small" ? "min-w-[300px]" : "w-full"} min-h-[400px]`,
  };

  return (
    <div className="h-full overflow-y-auto">
      {/* 支出の円グラフ */}
      <div className="bg-white p-4">
        <h2 className={`text-lg font-semibold mb-4 ${size === "small" ? "text-center" : ""}`}>
          Expense Categories (Total: {formatAmount(totalExpense)})
        </h2>
        <div className="w-full overflow-x-auto">
          <div className={chartConfig.containerClass} style={{ height: chartConfig.height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart width={chartConfig.width} height={chartConfig.height}>
                <Pie
                  data={expensePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={chartConfig.outerRadius}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {expensePieData.map((entry, index) => (
                    <Cell key={`cell-expense-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
                <Legend
                  layout="vertical"
                  verticalAlign={align === "right" ? "middle" : "top"}
                  align={align === "right" ? "right" : "center"}
                  formatter={legendFormatter as unknown as undefined}
                />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 収入の円グラフ */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className={`text-lg font-semibold mb-4 ${size === "small" ? "text-center" : ""}`}>
          Income Sources (Total: {formatAmount(totalIncome)})
        </h2>
        <div className="w-full overflow-x-auto">
          <div className={chartConfig.containerClass} style={{ height: chartConfig.height }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartPieChart>
                <Pie
                  data={incomePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={chartConfig.outerRadius}
                  labelLine={false}
                  label={renderCustomizedLabel}
                >
                  {incomePieData.map((entry, index) => (
                    <Cell key={`cell-income-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
                <Legend
                  layout="vertical"
                  verticalAlign={align === "right" ? "middle" : "top"}
                  align={align === "right" ? "right" : "center"}
                  formatter={legendFormatter as unknown as undefined}
                />
              </RechartPieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
