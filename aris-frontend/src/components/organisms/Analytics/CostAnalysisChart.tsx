import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { accidentTrendData } from "../../data/mockData";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, SectionTitle, tooltipStyle } from "./shared";

export default function CostAnalysisChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.costAnalysis")}</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={accidentTrendData} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF0" vertical={false} />
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
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              `LKR ${formatLKR(Number(Array.isArray(value) ? value[0] : value ?? 0))}`,
              name,
            ]}
          />
          <Legend
            iconType="square"
            iconSize={9}
            wrapperStyle={{ fontSize: "11px", color: "#4B5D6E" }}
          />
          <Bar dataKey="losses"     name="Total Loss" fill="#922B21" radius={[2, 2, 0, 0]} />
          <Bar dataKey="recoveries" name="Recovered"  fill="#1B3A6B" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
