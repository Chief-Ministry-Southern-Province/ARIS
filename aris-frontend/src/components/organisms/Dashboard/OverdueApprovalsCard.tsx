import { AlertTriangle, Clock3, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useDashboardStatistics } from "@/hooks/useDashboard";

export function OverdueApprovalsCard() {
  const { t } = useTranslation();
  const { data: statistics, isLoading } = useDashboardStatistics();
  const approvals = statistics?.overdue_approvals ?? [];

  return (
    <section className="min-h-[280px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{t("dashboard.overdueApprovals")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("dashboard.overdueApprovalsSubtitle")}</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, index) => <div key={index} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}
        </div>
      ) : approvals.length ? (
        <div className="space-y-3">
          {approvals.map((approval) => {
            const critical = approval.waiting_hours >= 48;

            return (
              <div key={approval.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
                <Clock3 className={`h-4 w-4 shrink-0 ${critical ? "text-red-500" : "text-amber-500"}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{approval.case_number ?? "Case"} · {approval.document_type}</p>
                  <p className="truncate text-xs text-slate-500">{approval.approver_name ?? t("dashboard.unassignedApprover")} · {t("dashboard.step", { step: approval.step })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`whitespace-nowrap rounded-md px-2 py-1 text-xs font-semibold ${critical ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                    {approval.waiting_hours}h
                  </span>
                  <Link to={`/approvals/${approval.id}`} aria-label={`Open approval for ${approval.case_number ?? "case"}`} className="text-blue-700 hover:text-blue-900">
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-400">
          {t("dashboard.noOverdueApprovals")}
        </div>
      )}
    </section>
  );
}
