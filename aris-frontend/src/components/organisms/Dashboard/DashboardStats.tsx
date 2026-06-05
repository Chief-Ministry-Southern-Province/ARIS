import {
  AlertTriangle,
  Briefcase,
  Clock,
  CheckCircle,
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
      />

      <StatCard
        icon={Briefcase}
        title={t("dashboard.openInvestigations")}
        value={openInvestigations.toString()}
      />

      <StatCard
        icon={Clock}
        title={t("dashboard.pendingApprovals")}
        value={pendingApprovals.toString()}
      />

      <StatCard
        icon={CheckCircle}
        title={t("dashboard.completedCases")}
        value={completedCases.toString()}
      />

      <StatCard
        icon={CheckCircle}
        title={t("dashboard.totalLosses")}
        value={totalLosses.toString()}
      />

      <StatCard
        icon={CheckCircle}
        title={t("dashboard.recoveries")}
        value={recoveries.toString()}
      />
    </div>
  );
}