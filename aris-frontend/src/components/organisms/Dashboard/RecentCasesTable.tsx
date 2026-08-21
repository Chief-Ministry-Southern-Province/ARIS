import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import { useDashboardStatistics } from "@/hooks/useDashboard";

const statusConfig: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  OPEN: { bg: "bg-amber-50 dark:bg-amber-950/70", text: "text-amber-800 dark:text-amber-200", dot: "bg-amber-400 dark:bg-amber-300", label: "Open" },
  IN_PROGRESS: { bg: "bg-blue-50 dark:bg-blue-950/70", text: "text-blue-800 dark:text-blue-200", dot: "bg-blue-400 dark:bg-blue-300", label: "In Progress" },
  COMPLETED: { bg: "bg-emerald-50 dark:bg-emerald-950/70", text: "text-emerald-800 dark:text-emerald-200", dot: "bg-emerald-400 dark:bg-emerald-300", label: "Completed" },
};

const stageLabels: Record<string, string> = {
  ACCIDENT_REPORTED: "Accident Reported",
  FR1043: "FR1043",
  FR1044: "FR1044",
  FR109: "FR109",
  CLOSED: "Closed",
};

export const RecentCasesTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: statistics, isLoading } = useDashboardStatistics();
  const cases = statistics?.recent_cases ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="font-bold text-foreground">{t("dashboard.recentCases")}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Last 30 days activity</p>
        </div>
        <Link to="/cases" className="flex items-center gap-1 text-xs font-semibold text-blue-800 hover:underline">
          View All <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted">
              {["Case ID", "Incident", "Institution", "Date", "Stage", "Status"].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              [...Array(5)].map((_, index) => (
                <tr key={index}>
                  <td colSpan={6} className="px-4 py-4"><div className="h-4 animate-pulse rounded bg-muted" /></td>
                </tr>
              ))
            ) : cases.length ? (
              cases.map((caseItem) => {
                const status = statusConfig[caseItem.status] ?? {
                  bg: "bg-slate-50",
                  text: "text-slate-700",
                  dot: "bg-slate-400",
                  label: caseItem.status,
                };

                return (
                  <tr
                    key={caseItem.id}
                    tabIndex={0}
                    onClick={() => navigate(`/cases/${caseItem.id}/details`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/cases/${caseItem.id}/details`);
                      }
                    }}
                    className="cursor-pointer transition-colors hover:bg-secondary focus:bg-secondary focus:outline-none"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-bold text-blue-800">{caseItem.case_number}</span>
                    </td>
                    <td className="max-w-48 px-4 py-3">
                      <div className="text-xs font-semibold leading-tight text-slate-800">{caseItem.incident ?? "Accident"}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-400">{caseItem.location ?? "—"}</div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">{caseItem.institution ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">{caseItem.accident_date ?? "—"}</td>
                    <td className="px-4 py-3">
                        <span className="inline-flex whitespace-nowrap rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/75 dark:text-indigo-200">
                        {stageLabels[caseItem.stage] ?? caseItem.stage}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No cases created in the last 30 days.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
