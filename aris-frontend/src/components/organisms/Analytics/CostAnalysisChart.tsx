import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

import type { CostAnalysisTrendPoint } from "@/types/analytics.type";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, SectionTitle, chartAxis, chartGrid, tooltipStyle } from "./shared";

interface CostAnalysisChartProps {
  data?: CostAnalysisTrendPoint[];
  isLoading: boolean;
}

export default function CostAnalysisChart({ data = [], isLoading }: CostAnalysisChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.costAnalysis")}</SectionTitle>
      {isLoading ? (
        <div className="h-[220px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/80" />
      ) : data.length ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barGap={3} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartAxis }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: chartAxis }} axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={false}
              formatter={(value, name) => [formatLKR(Number(Array.isArray(value) ? value[0] : value ?? 0)), name]}
            />
            <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: "11px", color: chartAxis }} />
            <Bar activeBar={false} dataKey="losses" name={t("analytics.legend.totalLoss")} fill="var(--chart-5)" radius={[3, 3, 0, 0]} />
            <Bar activeBar={false} dataKey="recoveries" name={t("analytics.legend.recovered")} fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
          {t("analytics.noDataForPeriod")}
        </div>
      )}
    </Card>
  );
}
