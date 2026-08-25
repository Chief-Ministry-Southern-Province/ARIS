import {
  CheckCircle2,
  ThumbsUp,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import type{ Approval, ApprovalStatsCounts } from "@/types/approval.type";

interface Props {
  approvals: Approval[];
  counts?: ApprovalStatsCounts;
}

export default function ApprovalStats({
  approvals,
  counts,
}: Props) {
  const { t } = useTranslation();

  const pending = counts?.pending ?? approvals.filter(a => a.status === "PENDING").length;

  const approved = counts?.approved ?? approvals.filter(a => a.status === "APPROVED").length;

  const recommended = counts?.recommended ?? approvals.filter(a => a.status === "RECOMMENDED").length;

  const rejected = counts?.rejected ?? approvals.filter(a => a.status === "REJECTED").length;

  const total = counts?.total ?? approvals.length;

  const cards = [

    {
      title: t("approvalCenter.pending"),
      value: pending,
      icon: Clock3,
      color: "text-yellow-600 dark:text-yellow-300",
      bg: "bg-yellow-100 dark:bg-yellow-950/70",
    },

    {
      title: t("approvalCenter.recommended"),
      value: recommended,
      icon: ThumbsUp,
      color: "text-blue-600 dark:text-blue-300",
      bg: "bg-blue-100 dark:bg-blue-950/70",
    },

    {
      title: t("approvalCenter.approved"),
      value: approved,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-300",
      bg: "bg-green-100 dark:bg-green-950/70",
    },

    {
      title: t("approvalCenter.rejected"),
      value: rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-300",
      bg: "bg-red-100 dark:bg-red-950/70",
    },

    {
      title: t("approvalCenter.total"),
      value: total,
      icon: FileText,
      color: "text-blue-700 dark:text-blue-300",
      bg: "bg-blue-100 dark:bg-blue-950/70",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">

      {cards.map(card => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500 dark:text-slate-400">

                  {card.title}

                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">

                  {card.value}

                </h2>

              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}
              >

                <Icon className={`w-6 h-6 ${card.color}`} />

              </div>

            </div>

          </div>

        );

      })}

    </div>

  );

}
