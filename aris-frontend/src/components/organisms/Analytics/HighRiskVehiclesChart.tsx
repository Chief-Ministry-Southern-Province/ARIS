import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { vehicleRiskData } from "../../data/mockData";
import { Card, SectionTitle, tooltipStyle } from "./shared";

export default function HighRiskVehiclesChart() {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.highRiskVehicles")}</SectionTitle>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={vehicleRiskData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF0" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#7A8F9E" }}
            axisLine={{ stroke: "#C5CDD6" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="vehicle"
            tick={{ fontSize: 11, fill: "#4B5D6E" }}
            width={90}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="risk" name="Risk Score" radius={[0, 3, 3, 0]}>
            {vehicleRiskData.map((entry, i) => (
              <Cell
                key={i}
                fill={
                  entry.risk > 70 ? "#922B21"
                  : entry.risk > 50 ? "#B7791F"
                  : "#1B3A6B"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
