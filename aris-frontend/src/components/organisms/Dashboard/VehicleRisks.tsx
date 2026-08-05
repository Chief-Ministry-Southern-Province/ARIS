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

export const VehicleRisks = () => {
  const { t } = useTranslation();
  const { data: statistics } = useDashboardStatistics();
  const vehicleRiskData = statistics?.vehicle_risks ?? [];

  return (
    <div className="min-h-[365px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-1">
        <h3 className="text-lg font-bold text-slate-900">
          {t("dashboard.vehicleRisk")}
        </h3>
        <p className="mt-1 text-xs text-slate-500">Fiscal-year accident rate by vehicle type</p>
      </div>

      <ResponsiveContainer width="100%" height={270}>
        <BarChart data={vehicleRiskData} layout="vertical" margin={{ top: 16, right: 10, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E8EEF7" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis
            type="category"
            dataKey="vehicle"
            tick={{ fontSize: 11, fill: "#64748B" }}
            width={92}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value, _name, item) => [
              `${value}% (${item.payload.incidents} incident${item.payload.incidents === 1 ? "" : "s"})`,
              "Risk score",
            ]}
          />
          <Bar dataKey="risk" name="Risk score" radius={[0, 7, 7, 0]} barSize={18}>
            {vehicleRiskData.map((entry) => (
              <Cell
                key={entry.vehicle}
                fill={entry.risk > 70 ? "#EF4444" : entry.risk > 50 ? "#F59E0B" : "#2445B3"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
