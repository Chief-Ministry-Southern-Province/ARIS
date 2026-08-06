import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  period: string;
  periods: string[];
  onPeriodChange: (period: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function Header({ period, periods, onPeriodChange, onRefresh, isRefreshing }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:px-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("analytics.title")}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{t("analytics.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="rounded-lg px-3 py-2 text-sm focus:outline-none"
          style={{
            background: "#115fdc",
            border: "1px solid #3A6AAA",
            color: "#E8F0F9",
          }}
        >
          {periods.map((option) => <option key={option}>{option}</option>)}
        </select>
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          style={{
            background: "#115fdc",
            border: "1px solid #3A6AAA",
            color: "#E8F0F9",
          }}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {t("analytics.refresh")}
        </button>
      </div>
    </div>
  );
}
