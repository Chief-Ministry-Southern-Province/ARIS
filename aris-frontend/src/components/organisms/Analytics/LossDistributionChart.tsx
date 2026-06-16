import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useTranslation } from "react-i18next";
import { lossCategoryData } from "../../data/mockData";
import { formatLKR } from "@/utils/formatCurrency";
import { Card, SectionTitle, tooltipStyle, GOV_COLORS } from "./shared";

export default function LossDistributionChart() {
  const { t } = useTranslation();

  const totalLoss = useMemo(
    () => lossCategoryData.reduce((s, d) => s + d.value, 0),
    []
  );

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.lossDistribution")}</SectionTitle>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={lossCategoryData}
            cx="50%"
            cy="50%"
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={false}
            strokeWidth={1}
            stroke="#F0F3F7"
          >
            {lossCategoryData.map((_, i) => (
              <Cell key={i} fill={GOV_COLORS[i % GOV_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => [
              `LKR ${formatLKR(Number(Array.isArray(value) ? value[0] : value ?? 0))}`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-1.5 mt-2">
        {lossCategoryData.map((item, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm" style={{ background: GOV_COLORS[i] }} />
              <span style={{ color: "#4B5D6E" }}>{item.name}</span>
            </div>
            <span className="font-semibold" style={{ color: "#1B3A6B" }}>
              {((item.value / totalLoss) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
