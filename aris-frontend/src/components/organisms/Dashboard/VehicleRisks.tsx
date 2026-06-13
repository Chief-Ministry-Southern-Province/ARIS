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
import { vehicleRiskData } from "../../data/mockData"
import { useTranslation } from 'react-i18next'

export const VehicleRisks = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-gray-800 mb-4">{t("dashboard.vehicleRisk")}</h3>
          <ResponsiveContainer width="100%" height={190}>
            <BarChart data={vehicleRiskData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="vehicle" tick={{ fontSize: 10, fill: "#64748B" }} width={85} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value) => `${value}/100`} />
              <Bar dataKey="risk" name="Risk Score" radius={[0, 5, 5, 0]} barSize={14}>
                {vehicleRiskData.map((entry, i) => (
                  <Cell key={i} fill={entry.risk > 70 ? "#EF4444" : entry.risk > 50 ? "#F59E0B" : "#1E40AF"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
  )
}
