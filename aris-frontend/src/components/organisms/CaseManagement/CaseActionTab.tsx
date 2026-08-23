import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAction } from "@/components/data/caseManagement";
import type { FormActionMode } from "@/types/AccidentCase.type";

const CaseActionTab = ({ id, modes }: { id: number; modes: Record<"fr1043" | "fr1044" | "fr109", FormActionMode> }) => {

  const { t } = useTranslation();
  const actions = getAction(id, t, modes);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {actions.map(({ label, icon: Icon, color, path }) => (
        <Link
          key={label}
          to={path}
          className={`
            group
            flex items-center justify-between
            p-4
            rounded-xl
            border
            transition-all
            duration-200
            hover:shadow-md
            hover:-translate-y-0.5
            ${color}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100/80 dark:bg-emerald-900/70">
              <Icon className="w-5 h-5" />
            </div>

            <span className="font-medium text-sm">
              {label}
            </span>
          </div>

          <svg
            className="w-4 h-4 opacity-50 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      ))}
    </div>
  )
}

export default CaseActionTab
