import {
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import { ChartHeader } from "@/components/molecules/ChartHeader";
import { ChartCard } from "@/components/molecules/ChartCard";
import { accidentTrendData,lossCategoryData } from "../../data/mockData";
import { CustomTooltip } from "@/components/atoms/CustomTooltip";
import {LossCategoryItem} from "@/components/molecules/LossCategoryItem";
import { Cell, Pie, PieChart } from "recharts";
import { formatLKR } from "@/utils/formatCurrency";

export function AccidentTrendChart() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Accident Trends */}
      <ChartCard className="lg:col-span-2">
        <ChartHeader
          title={t("accidentTrends")}
          subtitle="Jul 2023 – Mar 2024"
        />

        <ResponsiveContainer
          width="100%"
          height={220}
        >
          <AreaChart data={accidentTrendData}>
            <defs>
              <linearGradient
                id="gAcc"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0}
                />
              </linearGradient>

              <linearGradient
                id="gLoss"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tick={{
                fill: "var(--muted-foreground)",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              yAxisId="left"
              tick={{
                fill: "var(--muted-foreground)",
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{
                fill: "var(--muted-foreground)",
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              yAxisId="left"
              dataKey="accidents"
              stroke="var(--chart-1)"
              fill="url(#gAcc)"
            />

            <Area
              yAxisId="right"
              dataKey="losses"
              stroke="var(--chart-5)"
              fill="url(#gLoss)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Loss Categories */}
      <ChartCard className="lg:col-span-1">
        <ChartHeader 
          title={t("lossCategories")} 
          subtitle={"Total: LKR 9.6M"}
          /> 

          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={lossCategoryData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={68}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {lossCategoryData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={`var(--chart-${(index % 5) + 1})`}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  formatLKR(typeof value === "number" ? value : 0)
                }
              />
            </PieChart>
          </ResponsiveContainer>

        <div className="space-y-2 mt-2">
            {lossCategoryData.map((item, index) => (
              <LossCategoryItem
                key={index}
                name={item.name}
                value={item.value}
                color={`var(--chart-${(index % 5) + 1})`}
              />
            ))}
          </div>
      </ChartCard>

    </div>
  );
}