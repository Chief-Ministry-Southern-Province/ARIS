import { lazy, Suspense, useState } from "react";

import Header  from "@/components/organisms/Analytics/Header";
import KpiGrid from "@/components/organisms/Analytics/KpiGrid";
import RepeatIncidentsTable  from "@/components/organisms/Analytics/RepeatIncidentsTable";
import GISHotspotsTable  from "@/components/organisms/Analytics/GISHotspotsTable";

// Lazy loaded chart components
const AccidentFrequencyChart = lazy(
  () => import("@/components/organisms/Analytics/AccidentFrequencyChart")
);

const CostAnalysisChart = lazy(
  () => import("@/components/organisms/Analytics/CostAnalysisChart")
);

const RecoveryAnalysisChart = lazy(
  () => import("@/components/organisms/Analytics/RecoveryAnalysisChart")
);

const LossDistributionChart = lazy(
  () => import("@/components/organisms/Analytics/LossDistributionChart")
);

const HighRiskVehiclesChart = lazy(
  () => import("@/components/organisms/Analytics/HighRiskVehiclesChart")
);

const InstitutionComparisonChart = lazy(
  () => import("@/components/organisms/Analytics/InstitutionComparisonChart")
);

function ChartSkeleton() {
  return (
    <div
      className="h-70 rounded-sm animate-pulse"
      style={{
        background: "#D1D9E0",
        border: "1px solid #D1D9E0",
      }}
    />
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-6" style={{ background: "#F0F3F7" }}>
      <div
        className="rounded-sm px-6 py-4 h-16 animate-pulse"
        style={{ background: "#1B3A6B" }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-sm animate-pulse"
            style={{ background: "#D1D9E0" }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <ChartSkeleton key={i} />
        ))}
      </div>

      <ChartSkeleton />
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("FY2023-24");

  return (
    <div className="min-h-screen p-6 space-y-6">
      <Header
        period={period}
        onPeriodChange={setPeriod}
      />

      <KpiGrid />

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Suspense fallback={<ChartSkeleton />}>
          <AccidentFrequencyChart />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <CostAnalysisChart />
        </Suspense>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Suspense fallback={<ChartSkeleton />}>
          <RecoveryAnalysisChart />
        </Suspense>

        <Suspense fallback={<ChartSkeleton />}>
          <LossDistributionChart />
        </Suspense>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Suspense fallback={<ChartSkeleton />}>
          <HighRiskVehiclesChart />
        </Suspense>

        <RepeatIncidentsTable />
      </div>

      {/* Institution Comparison */}
      <Suspense fallback={<ChartSkeleton />}>
        <InstitutionComparisonChart />
      </Suspense>

      {/* Table */}
      <GISHotspotsTable />
    </div>
  );
}