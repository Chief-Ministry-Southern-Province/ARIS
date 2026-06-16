import { RefreshCw } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HeaderProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export default function Header({ period, onPeriodChange }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="rounded-sm px-6 py-4 flex items-center justify-between flex-wrap gap-3">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">{t("analytics.title")}</h1>
              <p className="text-sm text-gray-500 mt-0.5">{t("analytics.subtitle")}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-3 py-2 text-sm focus:outline-none rounded-sm"
          style={{
            background: "#115fdc",
            border: "1px solid #3A6AAA",
            color: "#E8F0F9",
          }}
        >
          <option>FY2023-24</option>
          <option>FY2022-23</option>
          <option>Q4 2024</option>
        </select>
        <button
          className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors"
          style={{
            background: "#115fdc",
            border: "1px solid #3A6AAA",
            color: "#E8F0F9",
          }}
        >
          <RefreshCw className="w-4 h-4" />
          {t("analytics.refresh")}
        </button>
      </div>
    </div>
  );
}
