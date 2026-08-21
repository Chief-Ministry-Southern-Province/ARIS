import {
  Bar,
  BarChart,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslation } from "react-i18next";

import { useDashboardStatistics } from "@/hooks/useDashboard";
import { chartAxis, chartAxisStrong, chartGrid, tooltipStyle } from "@/components/organisms/Analytics/shared";

export const VehicleRisks = () => {
  const { t } = useTranslation();
  const { data: statistics } = useDashboardStatistics();
  const vehicleRiskData = statistics?.vehicle_risks ?? [];

  return (
    <div className="min-h-[365px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:p-6">
      <div className="mb-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {t("dashboard.vehicleRisk")}
        </h3>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Fiscal-year accident rate by vehicle type</p>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={vehicleRiskData} layout="vertical" margin={{ top: 16, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: chartAxis }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="vehicle"
            tick={{ fontSize: 11, fill: chartAxisStrong }}
            width={92}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={false}
            formatter={(value, _name, item) => [
              `${value}% (${item.payload.incidents} incident${item.payload.incidents === 1 ? "" : "s"})`,
              "Risk score",
            ]}
          />
          <Bar activeBar={false} dataKey="risk" name="Risk score" radius={[0, 7, 7, 0]} barSize={18}>
            {vehicleRiskData.map((entry) => (
              <Cell
                key={entry.vehicle}
                fill={entry.risk > 70 ? "var(--chart-5)" : entry.risk > 50 ? "var(--chart-4)" : "var(--chart-2)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
