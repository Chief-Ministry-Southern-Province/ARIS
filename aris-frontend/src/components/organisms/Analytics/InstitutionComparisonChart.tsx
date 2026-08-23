import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

import type { InstitutionComparisonPoint } from "@/types/analytics.type";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, SectionTitle, chartAxis, chartGrid, tooltipStyle } from "./shared";

interface InstitutionComparisonChartProps {
  data?: InstitutionComparisonPoint[];
  isLoading: boolean;
}

export default function InstitutionComparisonChart({ data = [], isLoading }: InstitutionComparisonChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.institutionComparison")}</SectionTitle>
      {isLoading ? (
        <div className="h-[250px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/80" />
      ) : data.length ? (
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} barGap={4} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: chartAxis }} axisLine={false} tickLine={false} interval={0} />
            <YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 11, fill: chartAxis }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: chartAxis }} axisLine={false} tickLine={false} tickFormatter={(value) => `${(value / 1_000_000).toFixed(1)}M`} />
            <Tooltip
              contentStyle={tooltipStyle}
              cursor={false}
              formatter={(value, name) => [name === t("analytics.legend.lossesLKR") ? formatLKR(Number(value)) : value, name]}
            />
            <Legend iconType="square" iconSize={9} wrapperStyle={{ fontSize: "11px", color: chartAxis }} />
            <Bar activeBar={false} yAxisId="left" dataKey="accidents" name={t("analytics.legend.accidents")} fill="var(--chart-2)" radius={[3, 3, 0, 0]} />
            <Bar activeBar={false} yAxisId="right" dataKey="losses" name={t("analytics.legend.lossesLKR")} fill="var(--chart-5)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[250px] items-center justify-center text-sm text-slate-400">{t("analytics.noDataForPeriod")}</div>
      )}
    </Card>
  );
}
