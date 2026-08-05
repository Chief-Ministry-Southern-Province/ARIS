import { DashboardStats } from "@/components/organisms/Dashboard/DashboardStats";
import { AccidentTrendChart } from "@/components/organisms/Dashboard/AccidentTrendChart";
import { RecentCasesTable } from "@/components/organisms/Dashboard/RecentCasesTable";
import { HotspotMapCard } from "@/components/organisms/Dashboard/HotspotMap";
import { VehicleRisks } from "@/components/organisms/Dashboard/VehicleRisks";
import { RecentActivities } from "../organisms/Dashboard/RecentActivities";
import AwaitingCases from "../organisms/workflow/AwaitingCases";
import { useDashboardStatistics } from "@/hooks/useDashboard";

import { t } from "i18next";
import { AlertTriangle,LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  const { data: statistics } = useDashboardStatistics();

  return (
    <div className="space-y-6">

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <LayoutDashboard className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {t("dashboard.title")}
                </h1>

                <p className="text-sm text-slate-500">
                  Fleet Management Dashboard
                </p>
              </div>
            </div>
          </div>

          <button
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
          </button>
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

      <AccidentTrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <VehicleRisks />
        <HotspotMapCard />
        <RecentActivities />
      </div>

      <RecentCasesTable />
      <AwaitingCases />
    </div>
  );
}
