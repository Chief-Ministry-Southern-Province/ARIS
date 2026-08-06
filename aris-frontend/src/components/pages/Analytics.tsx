import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import Header  from "@/components/organisms/Analytics/Header";
import KpiGrid from "@/components/organisms/Analytics/KpiGrid";
import RepeatIncidentsTable  from "@/components/organisms/Analytics/RepeatIncidentsTable";
import GISHotspotsTable  from "@/components/organisms/Analytics/GISHotspotsTable";
import { useAnalytics } from "@/hooks/useAnalytics";

function currentFiscalPeriod() {
  const today = new Date();
  const startYear = today.getMonth() >= 6 ? today.getFullYear() : today.getFullYear() - 1;

  return `FY${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
}

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
      className="h-[280px] animate-pulse rounded-2xl"
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
  const { t } = useTranslation();
  const [period, setPeriod] = useState(currentFiscalPeriod);
  const { data: analytics, isFetching, isLoading, isError, refetch } = useAnalytics(period);

  return (
    <div className="mx-auto max-w-[1600px] space-y-8 p-4 sm:p-6">
      <Header
        period={period}
        periods={analytics?.available_periods ?? [period]}
        onPeriodChange={setPeriod}
        onRefresh={() => void refetch()}
        isRefreshing={isFetching}
      />

      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Unable to load analytics for the selected period. Please refresh and try again.
        </div>
      )}

      <KpiGrid kpis={analytics?.kpis} isLoading={isLoading} />

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("analytics.sections.overview")}</h2>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Suspense fallback={<ChartSkeleton />}>
            <AccidentFrequencyChart
              data={analytics?.accident_frequency_trend}
              isLoading={isLoading}
            />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <CostAnalysisChart
              data={analytics?.cost_analysis_trend}
              isLoading={isLoading}
            />
          </Suspense>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("analytics.sections.financialInsights")}</h2>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <Suspense fallback={<ChartSkeleton />}>
            <RecoveryAnalysisChart />
          </Suspense>
          <Suspense fallback={<ChartSkeleton />}>
            <LossDistributionChart />
          </Suspense>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("analytics.sections.riskAndPerformance")}</h2>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <Suspense fallback={<ChartSkeleton />}>
            <HighRiskVehiclesChart
              data={analytics?.high_risk_vehicle_types}
              isLoading={isLoading}
            />
          </Suspense>
          <RepeatIncidentsTable />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{t("analytics.sections.institutionAndLocation")}</h2>
        <Suspense fallback={<ChartSkeleton />}>
          <InstitutionComparisonChart />
        </Suspense>
        <GISHotspotsTable data={analytics?.hotspots} isLoading={isLoading} />
      </section>
    </div>
  );
}
