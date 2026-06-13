import {
  AlertTriangle,
  Briefcase,
  Clock,
  CheckCircle,
  RefreshCw,
  TrendingDown,
} from "lucide-react";

import { StatCard } from "@/components/molecules/StatCard"
import { useTranslation } from "react-i18next";

interface DashboardStatsProps {
  totalIncidents: number;
  openInvestigations: number;
  pendingApprovals: number;
  completedCases: number;
  totalLosses: number;
  recoveries: number;
}

export function DashboardStats({ totalIncidents, openInvestigations, pendingApprovals, completedCases, totalLosses, recoveries }: DashboardStatsProps) {

  const { t } = useTranslation();

  return (
     <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
  <StatCard
    icon={AlertTriangle}
    title={t("dashboard.totalIncidents")}
    value={totalIncidents.toString()}
    subtitle={t("dashboard.thisFiscalYear")}
    gradient="bg-gradient-to-br from-blue-500 to-blue-700"
    trend={{ up: true, value: "+12%" }}
  />

  <StatCard
    icon={Briefcase}
    title={t("dashboard.openInvestigations")}
    value={openInvestigations.toString()}
    subtitle={t("dashboard.activeCases")}
    gradient="bg-gradient-to-br from-orange-400 to-orange-600"
    trend={{ up: true, value: "+5%" }}
  />

  <StatCard
    icon={Clock}
    title={t("dashboard.pendingApprovals")}
    value={pendingApprovals.toString()}
    subtitle={t("dashboard.awaitingReview")}
    gradient="bg-gradient-to-br from-yellow-400 to-amber-500"
    trend={{ up: false, value: "-2" }}
  />

  <StatCard
    icon={CheckCircle}
    title={t("dashboard.completedCases")}
    value={completedCases.toString()}
    subtitle={t("dashboard.thisFiscalYear")}
    gradient="bg-gradient-to-br from-emerald-400 to-green-600"
    trend={{ up: false, value: "+18%" }}
  />

  <StatCard
    icon={TrendingDown}
    title={t("dashboard.totalLosses")}
    value={`LKR ${totalLosses.toLocaleString()}`}
    subtitle={t("dashboard.estimatedTotal")}
    gradient="bg-gradient-to-br from-red-400 to-rose-600"
    trend={{ up: true, value: "+8%" }}
  />

  <StatCard
    icon={RefreshCw}
    title={t("dashboard.recoveries")}
    value={`LKR ${recoveries.toLocaleString()}`}
    subtitle={t("dashboard.recoveryRate")}
    gradient="bg-gradient-to-br from-teal-400 to-cyan-600"
    trend={{ up: false, value: "+22%" }}
  />
</div>

  );
}