import {
  CheckCircle2,
  Clock3,
  FileText,
  XCircle,
} from "lucide-react";

import type{ Approval, ApprovalStatsCounts } from "@/types/approval.type";

interface Props {
  approvals: Approval[];
  counts?: ApprovalStatsCounts;
}

export default function ApprovalStats({
  approvals,
  counts,
}: Props) {

  const pending = counts?.pending ?? approvals.filter(a => a.status === "PENDING").length;

  const approved = counts?.approved ?? approvals.filter(a => a.status === "APPROVED").length;

  const rejected = counts?.rejected ?? approvals.filter(a => a.status === "REJECTED").length;

  const total = counts?.total ?? approvals.length;

  const cards = [

    {
      title: "Pending",
      value: pending,
      icon: Clock3,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },

    {
      title: "Approved",
      value: approved,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-100",
    },

    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-100",
    },

    {
      title: "Total",
      value: total,
      icon: FileText,
      color: "text-[#0F4C81]",
      bg: "bg-[#0F4C81]/10",
    },

  ];

  return (

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

      {cards.map(card => {

        const Icon = card.icon;

        return (

          <div
            key={card.title}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-slate-500">

                  {card.title}

                </p>

                <h2 className="text-3xl font-bold mt-2">

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
