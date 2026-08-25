import { CheckCircle2, Clock3, XCircle, Circle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  status: string;
}

export default function ApprovalStatusBadge({ status }: Props) {
  const { t } = useTranslation();

  const config = {
    PENDING: {
      labelKey: "pending",
      icon: Clock3,
      className: "bg-yellow-100 text-yellow-700",
    },
    WAITING: {
      labelKey: "waiting",
      icon: Circle,
      className: "bg-slate-100 text-slate-600",
    },
    RECOMMENDED: {
      labelKey: "recommended",
      icon: CheckCircle2,
      className: "bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-200",
    },
    APPROVED: {
      labelKey: "approved",
      icon: CheckCircle2,
      className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-200",
    },
    REJECTED: {
      labelKey: "rejected",
      icon: XCircle,
      className: "bg-red-100 text-red-700",
    },
  };

  const item =
    config[status as keyof typeof config] ??
    config.WAITING;

  const Icon = item.icon;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${item.className}`}
    >
      <Icon className="w-4 h-4" />
      {t(`approvalWorkflow.statuses.${item.labelKey}`)}
    </span>
  );
}
