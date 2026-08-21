import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

import type { AccidentFrequencyTrendPoint } from "@/types/analytics.type";
import { Card, SectionTitle, tooltipStyle } from "./shared";

interface AccidentFrequencyChartProps {
  data?: AccidentFrequencyTrendPoint[];
  isLoading: boolean;
}

export default function AccidentFrequencyChart({ data = [], isLoading }: AccidentFrequencyChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.accidentFrequencyTrend")}</SectionTitle>
      {isLoading ? (
        <div className="h-[220px] animate-pulse rounded-xl bg-slate-100" />
      ) : data.length ? (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563A8" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2563A8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF0" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#7A8F9E" }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#7A8F9E" }} axisLine={false} tickLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area
              type="monotone"
              dataKey="accidents"
              name={t("analytics.legend.accidents")}
              stroke="#1B3A6B"
              fill="url(#freqGrad)"
              strokeWidth={2}
              dot={{ fill: "#1B3A6B", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[220px] items-center justify-center text-sm text-slate-400">
          {t("analytics.noDataForPeriod")}
        </div>
      )}
    </Card>
  );
}
