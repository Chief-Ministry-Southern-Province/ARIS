import { DashboardStats } from "@/components/organisms/Dashboard/DashboardStats";
import { AccidentTrendChart } from "@/components/organisms/Dashboard/AccidentTrendChart";
import { RecentCasesTable } from "@/components/organisms/Dashboard/RecentCasesTable";
import { HotspotMapCard } from "@/components/organisms/Dashboard/HotspotMap";
import { VehicleRisks } from "@/components/organisms/Dashboard/VehicleRisks";
import { OverdueApprovalsCard } from "@/components/organisms/Dashboard/OverdueApprovalsCard";
import { CaseStageFunnel } from "@/components/organisms/Dashboard/CaseStageFunnel";
import { RecentActivities } from "../organisms/Dashboard/RecentActivities";
import AwaitingCases from "../organisms/workflow/AwaitingCases";
import { useDashboardStatistics } from "@/hooks/useDashboard";
import { useAuth } from "@/context/auth/AuthContext";
import { Link } from "react-router-dom";

import { t } from "i18next";
import { AlertTriangle,LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { data: statistics } = useDashboardStatistics();
  const { role, institutionType } = useAuth();
  const showApprovalInsights = !(
    role.includes("subject_officer")
    && ["BASE_HOSPITAL", "RDHS"].includes(institutionType ?? "")
  );
  const showAwaitingAction = (statistics?.pending_approvals ?? 0) > 0 && showApprovalInsights;
  const showReportAccident = role.includes("subject_officer")
    && ["BASE_HOSPITAL", "RDHS"].includes(institutionType ?? "");

  return (
    <div className="space-y-6">

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/70">
                <LayoutDashboard className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {t("dashboard.title")}
                </h1>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Fleet Management Dashboard
                </p>
              </div>
            </div>
          </div>

          {showReportAccident && (
          <Link
            to="/report"
            className="
              inline-flex items-center gap-2
              px-5 py-3
              rounded-xl
              bg-blue-800
              text-white
              text-sm font-semibold
              hover:bg-blue-900
              transition-all
            "
          >
            <AlertTriangle className="h-4 w-4" />
            {t("dashboard.reportIncident")}
          </Link>
          )}
        </div>
      </div>

      <DashboardStats
        totalIncidents={statistics?.total_incidents ?? 0}
        openInvestigations={statistics?.open_investigations ?? 0}
        pendingApprovals={statistics?.pending_approvals ?? 0}
        completedCases={statistics?.completed_cases ?? 0}
        totalLosses={statistics?.total_losses ?? 0}
        recoveries={statistics?.recoveries ?? 0}
      />

      {showAwaitingAction && <AwaitingCases />}

      <div className={showApprovalInsights ? "grid grid-cols-1 gap-5 xl:grid-cols-2" : ""}>
        {showApprovalInsights && <OverdueApprovalsCard />}
        <CaseStageFunnel />
      </div>

      <AccidentTrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <VehicleRisks />
        <HotspotMapCard />
      </div>

      <RecentActivities />

      <RecentCasesTable />
    </div>
  );
}
