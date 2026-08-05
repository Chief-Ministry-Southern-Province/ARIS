import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Check,
  FileText,
  Search,
  Upload,
  X,
} from "lucide-react";

import { useDashboardStatistics } from "@/hooks/useDashboard";

const activityIcons: Record<string, React.ReactNode> = {
  alert: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />,
  check: <Check className="h-3.5 w-3.5 text-emerald-500" />,
  upload: <Upload className="h-3.5 w-3.5 text-blue-500" />,
  search: <Search className="h-3.5 w-3.5 text-violet-500" />,
  file: <FileText className="h-3.5 w-3.5 text-orange-500" />,
  x: <X className="h-3.5 w-3.5 text-red-500" />,
};

function selectIcon(action: string) {
  if (action.includes("REJECTED") || action.includes("DELETED")) return "x";
  if (action.includes("APPROVED") || action.includes("COMPLETED") || action.includes("RECOMMENDED")) return "check";
  if (action.includes("EVIDENCE") || action.includes("ATTACHMENT")) return "upload";
  if (action.includes("SUBMITTED") || action.includes("DRAFT") || action.includes("FR")) return "file";
  if (action.includes("ASSIGNED") || action.includes("UPDATED")) return "search";

  return "alert";
}

function relativeTime(timestamp: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000));

  if (seconds < 60) return "just now";
  if (seconds < 3_600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86_400) return `${Math.floor(seconds / 3_600)} hr ago`;
  return `${Math.floor(seconds / 86_400)} day${seconds >= 172_800 ? "s" : ""} ago`;
}

export const RecentActivities = () => {
  const { t } = useTranslation();
  const { data: statistics, isLoading } = useDashboardStatistics();
  const activities = statistics?.recent_activities ?? [];

  return (
    <div className="min-h-[365px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">
          {t("dashboard.recentActivities")}
        </h3>
        <AlertTriangle className="h-4 w-4 text-slate-400" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-9 animate-pulse rounded bg-slate-100" />
          ))}
        </div>
      ) : activities.length ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                {activityIcons[selectIcon(activity.action)]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-xs leading-snug text-slate-700">
                  {activity.description}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {activity.user_name ?? "System"} · {relativeTime(activity.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-slate-400">
          No recent activity.
        </p>
      )}
    </div>
  );
};
