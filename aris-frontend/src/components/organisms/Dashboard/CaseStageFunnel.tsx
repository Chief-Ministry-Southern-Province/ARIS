import { CheckCircle2, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { useDashboardStatistics } from "@/hooks/useDashboard";

export function CaseStageFunnel() {
  const { t } = useTranslation();
  const { data: statistics, isLoading } = useDashboardStatistics();
  const stages = statistics?.case_stage_funnel ?? [];
  const maximum = Math.max(...stages.map((stage) => stage.count), 1);

  return (
    <section className="min-h-[280px] rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-foreground">{t("dashboard.caseStageFunnel")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.caseStageFunnelSubtitle")}</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => <div key={index} className="h-7 animate-pulse rounded bg-muted" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {stages.map((stage, index) => (
            <div key={stage.stage} className="flex items-center gap-3">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stage.stage === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-secondary text-primary"}`}>
                {stage.stage === "COMPLETED" ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                  <span className="font-medium text-foreground">
                    {stage.stage === "ACCIDENT_REPORTED"
                      ? t("dashboard.stageAccidentReported")
                      : stage.stage === "COMPLETED"
                        ? t("dashboard.stageCompleted")
                        : stage.label}
                  </span>
                  <span className="font-bold text-foreground">{stage.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${stage.stage === "COMPLETED" ? "bg-emerald-500" : "bg-blue-600"}`}
                    style={{ width: `${(stage.count / maximum) * 100}%` }}
                  />
                </div>
              </div>
              {index < stages.length - 1 && <ChevronRight className="hidden h-4 w-4 text-muted-foreground sm:block" />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
