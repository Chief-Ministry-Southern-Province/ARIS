import {
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { mockApprovalHistory } from "../data/mockData";
import AwaitingCases from "@/components/organisms/workflow/AwaitingCases";

function ApprovalWorkflow() {
  const { t } = useTranslation();

  const history = mockApprovalHistory;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {t("approvalWorkflow.title")}
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          {t("approvalWorkflow.subtitle")}
        </p>
      </div>

      {/* Approval Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("approvalWorkflow.approvalHistory")}
          </h2>

          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
            In Progress
          </span>
        </div>

        <div className="space-y-6">
          {history.map((item, index) => {
            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";
            const isProgress = item.status === "in_progress";

            return (
              <div key={item.step} className="flex gap-4">
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      isApproved
                        ? "bg-green-100"
                        : isRejected
                        ? "bg-red-100"
                        : isProgress
                        ? "bg-yellow-100"
                        : "bg-slate-100"
                    }`}
                  >
                    {isApproved ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : isRejected ? (
                      <X className="w-5 h-5 text-red-600" />
                    ) : isProgress ? (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  {index < history.length - 1 && (
                    <div className="w-px h-16 bg-slate-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-m">
                        {item.role}
                      </h4>

                      <p className="text-slate-500 mt-1">
                        {item.user}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
                      ${
                        isApproved
                          ? "bg-green-100 text-green-700"
                          : isRejected
                          ? "bg-red-100 text-red-700"
                          : isProgress
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.action}
                    </span>
                  </div>

                  {item.comment && (
                    <p className="mt-2 italic text-slate-600">
                      "{item.comment}"
                    </p>
                  )}

                  {item.date && (
                    <p className="mt-2 text-sm text-slate-400">
                      {item.date}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cases Awaiting Your Action */}
      <AwaitingCases />
    </div>
  );
}

export default ApprovalWorkflow;