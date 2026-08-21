import { useTranslation } from "react-i18next";

import type { RepeatIncidentDriverPoint } from "@/types/analytics.type";
import { Card, SectionTitle } from "./shared";

interface RepeatIncidentsTableProps {
  data?: RepeatIncidentDriverPoint[];
  isLoading: boolean;
}

export default function RepeatIncidentsTable({ data = [], isLoading }: RepeatIncidentsTableProps) {
  const { t } = useTranslation();
  const maximum = Math.max(...data.map((item) => item.incidents), 1);

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.repeatIncidentsDriverAnalysis")}</SectionTitle>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => <div key={index} className="h-9 animate-pulse rounded bg-slate-100 dark:bg-slate-800/80" />)}
        </div>
      ) : data.length ? (
        <div className="space-y-4">
          {data.map((item) => {
            const color = item.incidents >= 4 ? "#922B21" : item.incidents >= 3 ? "#B7791F" : "#1B3A6B";

            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ background: color }}>
                  {item.incidents}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-blue-900 dark:text-blue-200">{item.driver}</span>
                    <span className="max-w-[50%] truncate rounded-sm bg-blue-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/80 dark:text-blue-200">{item.institution}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-sm bg-slate-100">
                    <div className="h-full rounded-sm" style={{ width: `${(item.incidents / maximum) * 100}%`, background: color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex h-[200px] items-center justify-center text-sm text-slate-400">{t("analytics.noDataForPeriod")}</div>
      )}
    </Card>
  );
}
