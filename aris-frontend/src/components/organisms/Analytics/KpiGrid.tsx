import { AlertTriangle, Car, DollarSign, RefreshCw, TrendingDown, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AnalyticsContext } from "@/types/analytics.type";

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  changePercentage: number | null;
  increasedIsGood: boolean;
}

function KpiCard({ icon: Icon, label, value, changePercentage, increasedIsGood }: KpiCardProps) {
  const isIncrease = (changePercentage ?? 0) >= 0;
  const isFavourable = changePercentage !== null && (isIncrease ? increasedIsGood : !increasedIsGood);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 border-l-4 border-l-blue-600 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-4 w-4 text-blue-700" />
        </div>
        {changePercentage !== null && (
          <span className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide ${isFavourable ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {isIncrease ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(changePercentage).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight text-blue-700">{value}</div>
        <div className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-600">{label}</div>
      </div>
    </div>
  );
}

function compactLkr(value: number) {
  if (value >= 1_000_000) return `LKR ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `LKR ${(value / 1_000).toFixed(1)}K`;

  return `LKR ${value.toLocaleString()}`;
}

interface KpiGridProps {
  kpis?: AnalyticsContext["kpis"];
  isLoading: boolean;
}

export default function KpiGrid({ kpis, isLoading }: KpiGridProps) {
  const { t } = useTranslation();

  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => <div key={index} className="h-32 animate-pulse rounded-2xl bg-slate-100" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard icon={AlertTriangle} label={t("analytics.kpi.accidentFrequencyMonthly")} value={kpis.monthly_accident_frequency.value.toFixed(1)} changePercentage={kpis.monthly_accident_frequency.change_percentage} increasedIsGood={false} />
      <KpiCard icon={Car} label={t("analytics.kpi.highRiskVehicles")} value={kpis.high_risk_vehicles.value.toLocaleString()} changePercentage={kpis.high_risk_vehicles.change_percentage} increasedIsGood={false} />
      <KpiCard icon={DollarSign} label={t("analytics.kpi.totalCostImpact")} value={compactLkr(kpis.total_cost_impact.value)} changePercentage={kpis.total_cost_impact.change_percentage} increasedIsGood={false} />
      <KpiCard icon={RefreshCw} label={t("analytics.kpi.recoveryRate")} value={`${kpis.recovery_rate.value.toFixed(1)}%`} changePercentage={kpis.recovery_rate.change_percentage} increasedIsGood />
    </div>
  );
}
