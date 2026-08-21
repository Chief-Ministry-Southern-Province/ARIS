import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { AnalyticsHotspotPoint } from "@/types/analytics.type";
import { Card, SectionTitle } from "./shared";

interface GISHotspotsTableProps {
  data?: AnalyticsHotspotPoint[];
  isLoading: boolean;
}

const riskStyle = {
  HIGH: { className: "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-200", translation: "high" },
  MEDIUM: { className: "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-200", translation: "medium" },
  LOW: { className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200", translation: "low" },
} as const;

export default function GISHotspotsTable({ data = [], isLoading }: GISHotspotsTableProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <SectionTitle>{t("analytics.charts.gisHotspots")}</SectionTitle>
      {isLoading ? (
        <div className="h-44 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800/80" />
      ) : data.length ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700">
                {[t("analytics.table.location"), t("analytics.table.incidents"), t("analytics.table.severity"), t("analytics.table.coordinates")].map((column) => (
                  <th key={column} className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((spot) => {
                const style = riskStyle[spot.risk];

                return (
                  <tr key={spot.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/70">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-800 dark:text-blue-300" />
                        <span className="font-medium text-blue-900 dark:text-blue-200">{spot.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 font-semibold text-blue-900 dark:text-blue-300">{spot.count}</td>
                    <td className="px-3 py-2.5">
                      <span className={`rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${style.className}`}>
                        {t(`analytics.severity.${style.translation}`)}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-slate-500 dark:text-slate-400">{spot.latitude.toFixed(4)}, {spot.longitude.toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-44 items-center justify-center text-sm text-slate-400">{t("analytics.noDataForPeriod")}</div>
      )}
    </Card>
  );
}
