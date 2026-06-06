import { recentActivities } from "../../data/mockData";
import { useTranslation } from "react-i18next";
import { AlertTriangle, Check, FileText, Search, Upload, X } from "lucide-react";

const activityIcons: Record<string, React.ReactNode> = {
  alert: <AlertTriangle className="w-3.5 h-3.5 text-red-500" />,
  check: <Check className="w-3.5 h-3.5 text-green-500" />,
  upload: <Upload className="w-3.5 h-3.5 text-blue-500" />,
  search: <Search className="w-3.5 h-3.5 text-purple-500" />,
  file: <FileText className="w-3.5 h-3.5 text-orange-500" />,
  x: <X className="w-3.5 h-3.5 text-red-500" />,
};

const selectIcon = (type: string) => {
  switch (type) {
    case "new_case": return "alert";
    case "approval": return "check";
    case "upload": return "upload";
    case "investigation": return "search";
    case "pdf": return "file";
    case "rejection": return "x";
    default: return "alert";
  }
};

export const RecentActivities = () => {

  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">{t("recentActivities")}</h3>
        <AlertTriangle className="w-4 h-4 text-gray-400" />
      </div>
      <div className="space-y-3">
        {recentActivities.map((act) => (
          <div key={act.id} className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              {activityIcons[selectIcon(act.type)]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-snug line-clamp-2">{act.message}</p>
              <p className="text-xs text-gray-400 mt-0.5">{act.user} · {act.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
