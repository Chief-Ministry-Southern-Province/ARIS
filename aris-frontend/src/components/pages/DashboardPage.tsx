import { DashboardStats } from "@/components/organisms/Dashboard/DashboardStats";
import { AccidentTrendChart } from "@/components/organisms/Dashboard/AccidentTrendChart";
import { RecentCasesTable } from "@/components/organisms/Dashboard/RecentCasesTable";
import { HotspotMapCard } from "@/components/organisms/Dashboard/HotspotMap";
import { VehicleRisks } from "@/components/organisms/Dashboard/VehicleRisks";
import { RecentActivities } from "../organisms/Dashboard/RecentActivities";

import { t } from "i18next";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {t("dashboard.title")}
          </h1>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-sm hover:shadow-md
          "
        >
          <AlertTriangle className="w-4 h-4" />
          {t("dashboard.reportIncident")}
        </button>
      </div>

      <DashboardStats
        totalIncidents={47}
        openInvestigations={12}
        pendingApprovals={8}
        completedCases={27}
        totalLosses={150000}
        recoveries={50000}
      />

      <AccidentTrendChart />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <VehicleRisks />
        <HotspotMapCard />
        <RecentActivities />
      </div>

      <RecentCasesTable />
    </div>
  );
}