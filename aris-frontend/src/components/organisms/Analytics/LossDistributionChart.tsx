import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";

import type { LossDistributionPoint } from "@/types/analytics.type";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, CHART_COLORS, SectionTitle, tooltipStyle } from "./shared";

interface LossDistributionChartProps {
  data?: LossDistributionPoint[];
  isLoading: boolean;
}

export default function LossDistributionChart({ data = [], isLoading }: LossDistributionChartProps) {
  const { t } = useTranslation();
  const totalLoss = useMemo(() => data.reduce((total, item) => total + item.value, 0), [data]);

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.netLossByVehicleType")}</SectionTitle>
      {isLoading ? (
        <div className="h-[180px] animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/80" />
      ) : data.length ? (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={70} paddingAngle={2} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false} strokeWidth={1} stroke="var(--card)">
                {data.map((item, index) => <Cell key={item.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} cursor={false} formatter={(value, name) => [formatLKR(Number(value)), name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm" style={{ background: CHART_COLORS[index % CHART_COLORS.length] }} />
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-blue-900 dark:text-blue-300">{((item.value / totalLoss) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">{t("analytics.noDataForPeriod")}</div>
      )}
    </Card>
  );
}
