import { TrendingUp, TrendingDown, AlertTriangle, Car, DollarSign, RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change: string;
  up: boolean;
}

function KpiCard({ icon: Icon, label, value, change, up }: KpiCardProps) {
  return (
    <div
      className="bg-white rounded-sm p-5 flex flex-col gap-3"
      style={{
        border: "1px solid #D1D9E0",
        borderLeftWidth: "4px",
        borderLeftColor: "#115fdc",
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-9 h-9 rounded-sm flex items-center justify-center"
          style={{ background: "#E8EFF7" }}
        >
          <Icon className="w-4 h-4" style={{ color: "#115fdc" }} />
        </div>
        <span
          className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-sm tracking-wide"
          style={
            up
              ? { color: "#922B21", background: "#FDECEA" }
              : { color: "#1D6A3A", background: "#E6F4EC" }
          }
        >
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <div>
        <div className="text-2xl font-bold" style={{ color: "#115fdc", letterSpacing: "-0.5px" }}>
          {value}
        </div>
        <div className="text-xs font-medium mt-1 uppercase tracking-widest" style={{ color: "#4B5D6E" }}>
          {label}
        </div>
      </div>
    </div>
  );
}

export default function KpiGrid() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard icon={AlertTriangle} label={t("analytics.kpi.accidentFrequencyMonthly")} value="5.2" change="12%"  up={true}  />
      <KpiCard icon={Car} label={t("analytics.kpi.highRiskVehicles")} value="6" change="2 added" up={true}  />
      <KpiCard icon={DollarSign} label={t("analytics.kpi.totalCostImpact")} value="LKR 9.6M" change="8%" up={true}  />
      <KpiCard icon={RefreshCw} label={t("analytics.kpi.recoveryRate")} value="38.4%" change="5.2%" up={false} />
    </div>
  );
}
