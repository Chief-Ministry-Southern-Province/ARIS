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
import { useAuth } from "@/context/auth/AuthContext";

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
  const { role, institutionType } = useAuth();
  const showPendingApprovals = !(
    role.includes("subject_officer") &&
    ["BASE_HOSPITAL", "RDHS"].includes(institutionType ?? "")
  );

  return (
     <div className={`grid grid-cols-2 lg:grid-cols-3 ${showPendingApprovals ? "xl:grid-cols-6" : "xl:grid-cols-5"} gap-4`}>
  <StatCard
    icon={AlertTriangle}
    title={t("dashboard.totalIncidents")}
    value={totalIncidents.toString()}
    subtitle={t("dashboard.thisFiscalYear")}
    iconSurfaceClassName="bg-blue-100 dark:bg-blue-950/75"
    iconClassName="text-blue-700 dark:text-blue-300"
  />

  <StatCard
    icon={Briefcase}
    title={t("dashboard.openCases")}
    value={openInvestigations.toString()}
    subtitle={t("dashboard.activeCases")}
    iconSurfaceClassName="bg-orange-100 dark:bg-orange-950/75"
    iconClassName="text-orange-700 dark:text-orange-300"
  />

  {showPendingApprovals && (
    <StatCard
      icon={Clock}
      title={t("dashboard.pendingApprovalsRecommendations")}
      value={pendingApprovals.toString()}
      subtitle={t("dashboard.awaitingReview")}
      iconSurfaceClassName="bg-amber-100 dark:bg-amber-950/75"
      iconClassName="text-amber-700 dark:text-amber-300"
    />
  )}

  <StatCard
    icon={CheckCircle}
    title={t("dashboard.completedCases")}
    value={completedCases.toString()}
    subtitle={t("dashboard.thisFiscalYear")}
    iconSurfaceClassName="bg-emerald-100 dark:bg-emerald-950/75"
    iconClassName="text-emerald-700 dark:text-emerald-300"
  />

  <StatCard
    icon={TrendingDown}
    title={t("dashboard.totalLosses")}
    value={`LKR ${totalLosses.toLocaleString()}`}
    subtitle={t("dashboard.estimatedTotal")}
    iconSurfaceClassName="bg-rose-100 dark:bg-rose-950/75"
    iconClassName="text-rose-700 dark:text-rose-300"
  />

  <StatCard
    icon={RefreshCw}
    title={t("dashboard.recoveries")}
    value={`LKR ${recoveries.toLocaleString()}`}
    subtitle={t("dashboard.recoveryRate")}
    iconSurfaceClassName="bg-cyan-100 dark:bg-cyan-950/75"
    iconClassName="text-cyan-700 dark:text-cyan-300"
  />
</div>

  );
}
