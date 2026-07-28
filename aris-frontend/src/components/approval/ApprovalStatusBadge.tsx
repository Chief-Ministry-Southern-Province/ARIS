import { CheckCircle2, Clock3, XCircle, Circle } from "lucide-react";

interface Props {
  status: string;
}

export default function ApprovalStatusBadge({ status }: Props) {
  const config = {
    PENDING: {
      label: "Pending",
      icon: Clock3,
      className: "bg-yellow-100 text-yellow-700",
    },
    WAITING: {
      label: "Waiting",
      icon: Circle,
      className: "bg-slate-100 text-slate-600",
    },
    RECOMMENDED: {
      label: "Recommended",
      icon: CheckCircle2,
      className: "bg-blue-100 text-blue-700",
    },
    APPROVED: {
      label: "Approved",
      icon: CheckCircle2,
      className: "bg-green-100 text-green-700",
    },
    REJECTED: {
      label: "Rejected",
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
      {item.label}
    </span>
  );
}
