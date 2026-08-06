import { ArrowRight, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { usePendingApprovals } from "@/hooks/useApprovals";

function roleLabel(role: string | null) {
  if (!role) return "Approval";

  return `${role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")} Review`;
}

const AwaitingCases = () => {
  const { t } = useTranslation();
  const { data, isLoading } = usePendingApprovals(1, "");
  const approvals = data?.data.slice(0, 5) ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          {t("approvalWorkflow.casesAwaitingAction")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Cases currently waiting for your review and decision.
        </p>
      </div>

      <div className="space-y-4 p-5">
        {isLoading ? (
          [...Array(2)].map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-xl bg-slate-100" />
          ))
        ) : approvals.length ? (
          approvals.map((approval) => (
            <div
              key={approval.id}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>

                  <div>
                    <span className="font-mono font-semibold text-blue-700">
                      {approval.case.case_number}
                    </span>
                    <h3 className="mt-2 font-semibold text-slate-900">
                      {roleLabel(approval.approver.role)}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {approval.document_type}{approval.reference_number ? ` ${approval.reference_number}` : ""} is waiting for your review and decision.
                    </p>
                  </div>
                </div>

                <Link
                  to={`/approvals/${approval.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {t("approvalWorkflow.review")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center text-sm text-slate-400">
            You have no cases awaiting your action.
          </div>
        )}
      </div>
    </div>
  );
};

export default AwaitingCases;
