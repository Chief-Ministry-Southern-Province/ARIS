import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { Card, SectionTitle, tooltipStyle } from "./shared";

const institutionData = [
  { name: "CGH", accidents: 12, losses: 3_200_000 },
  { name: "KDH", accidents: 8,  losses: 1_850_000 },
  { name: "NHC", accidents: 7,  losses: 2_100_000 },
  { name: "KTH", accidents: 11, losses: 3_400_000 },
  { name: "WBH", accidents: 5,  losses: 1_100_000 },
  { name: "MRH", accidents: 4,  losses:   980_000 },
];

export default function InstitutionComparisonChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.institutionComparison")}</SectionTitle>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={institutionData} barGap={4}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#7A8F9E" }}
            axisLine={{ stroke: "#C5CDD6" }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#7A8F9E" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#7A8F9E" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            iconType="square"
            iconSize={9}
            wrapperStyle={{ fontSize: "11px", color: "#4B5D6E" }}
          />
          <Bar yAxisId="left"  dataKey="accidents" name="Accidents"    fill="#1B3A6B" radius={[2, 2, 0, 0]} />
          <Bar yAxisId="right" dataKey="losses"    name="Losses (LKR)" fill="#922B21" radius={[2, 2, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
