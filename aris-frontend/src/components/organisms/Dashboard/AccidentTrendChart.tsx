import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import { CustomTooltip } from "@/components/atoms/CustomTooltip";
import { ChartCard } from "@/components/molecules/ChartCard";
import { ChartHeader } from "@/components/molecules/ChartHeader";
import { useDashboardStatistics } from "@/hooks/useDashboard";

export function AccidentTrendChart() {
  const { t } = useTranslation();
  const { data: statistics } = useDashboardStatistics();
  const trendData = statistics?.accident_trends ?? [];
  const fiscalYearLabel = statistics
    ? `${new Date(`${statistics.fiscal_year_start}T00:00:00`).toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${new Date(`${statistics.fiscal_year_end}T00:00:00`).toLocaleDateString(undefined, { month: "short", year: "numeric" })}`
    : "Loading...";

  return (
    <ChartCard className="min-h-[365px] p-5 sm:p-6">
      <ChartHeader
        title={t("dashboard.accidentTrends")}
        subtitle={fiscalYearLabel}
      />

      <div className="h-[280px] sm:h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.24} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="gLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="var(--border)"
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />

            <YAxis
              yAxisId="left"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={34}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={52}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              yAxisId="left"
              dataKey="accidents"
              stroke="var(--chart-1)"
              fill="url(#gAcc)"
              strokeWidth={2}
              activeDot={{ r: 4 }}
            />

            <Area
              yAxisId="right"
              dataKey="losses"
              stroke="var(--chart-5)"
              fill="url(#gLoss)"
              strokeWidth={2}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
