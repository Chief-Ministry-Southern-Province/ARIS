import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTranslation } from "react-i18next";

import type { HighRiskVehicleTypePoint } from "@/types/analytics.type";
import { Card, SectionTitle, tooltipStyle } from "./shared";

interface HighRiskVehiclesChartProps {
  data?: HighRiskVehicleTypePoint[];
  isLoading: boolean;
}

export default function HighRiskVehiclesChart({ data = [], isLoading }: HighRiskVehiclesChartProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.highRiskVehicles")}</SectionTitle>
      {isLoading ? (
        <div className="h-[200px] animate-pulse rounded-xl bg-slate-100" />
      ) : data.length ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4EAF0" horizontal={false} />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#7A8F9E" }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
            <YAxis type="category" dataKey="vehicle" tick={{ fontSize: 11, fill: "#4B5D6E" }} width={96} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(value, _name, item) => [
                `${value}% (${item.payload.incidents} ${t("analytics.table.incidents").toLowerCase()})`,
                t("analytics.legend.riskScore"),
              ]}
            />
            <Bar dataKey="risk" name={t("analytics.legend.riskScore")} radius={[0, 4, 4, 0]}>
              {data.map((entry) => (
                <Cell key={entry.vehicle} fill={entry.risk > 70 ? "#922B21" : entry.risk > 50 ? "#B7791F" : "#1B3A6B"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex h-[200px] items-center justify-center text-sm text-slate-400">
          {t("analytics.noDataForPeriod")}
        </div>
      )}
    </Card>
  );
}
