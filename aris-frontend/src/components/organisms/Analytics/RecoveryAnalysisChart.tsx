import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { recoveryAnalysisData } from "../../data/mockData";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, SectionTitle, tooltipStyle } from "./shared";

export default function RecoveryAnalysisChart() {
  const { t } = useTranslation();

  return (
    <Card className="lg:col-span-2">
      <SectionTitle>{t("analytics.charts.recoveryAnalysis")}</SectionTitle>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={recoveryAnalysisData}>
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
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
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
          <Bar dataKey="insurance"    name="Insurance"    fill="#1B3A6B" stackId="a" />
          <Bar dataKey="disciplinary" name="Disciplinary" fill="#2563A8" stackId="a" />
          <Bar dataKey="other"        name="Other"        fill="#7FAFD9" stackId="a" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
