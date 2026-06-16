import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { accidentTrendData } from "../../data/mockData";
import { Card, SectionTitle, tooltipStyle } from "./shared";

export default function AccidentFrequencyChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.accidentFrequencyTrend")}</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={accidentTrendData}>
          <defs>
            <linearGradient id="freqGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563A8" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2563A8" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF0" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#7A8F9E" }}
            axisLine={{ stroke: "#C5CDD6" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#7A8F9E" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Area
            type="monotone"
            dataKey="accidents"
            name="Accidents"
            stroke="#1B3A6B"
            fill="url(#freqGrad)"
            strokeWidth={2}
            dot={{ fill: "#1B3A6B", r: 3, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
