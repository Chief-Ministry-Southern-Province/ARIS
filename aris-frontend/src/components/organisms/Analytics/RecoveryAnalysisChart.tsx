import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

import type { RecoveryAnalysisTrendPoint } from "@/types/analytics.type";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, SectionTitle, chartAxis, chartGrid, tooltipStyle } from "./shared";

interface RecoveryAnalysisChartProps {
  data?: RecoveryAnalysisTrendPoint[];
  isLoading: boolean;
}

export default function RecoveryAnalysisChart({ data = [], isLoading }: RecoveryAnalysisChartProps) {
  const { t } = useTranslation();

  return (
    <Card className="lg:col-span-2">
      <SectionTitle>{t("analytics.charts.recoveryAnalysis")}</SectionTitle>
      {isLoading ? (
        <div className="h-[220px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/80" />
      ) : data.length ? (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: chartAxis }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: chartAxis }} axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1_000).toFixed(0)}K`} />
            <Tooltip contentStyle={tooltipStyle} cursor={false} formatter={(value, name) => [formatLKR(Number(value)), name]} />
            <Bar activeBar={false} dataKey="recoveries" name={t("analytics.legend.recovered")} fill="var(--chart-3)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">{t("analytics.noDataForPeriod")}</div>
      )}
    </Card>
  );
}
