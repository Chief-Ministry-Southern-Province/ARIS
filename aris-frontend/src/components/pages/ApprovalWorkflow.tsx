import {
  Check,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { mockApprovalHistory } from "../data/mockData";

function ApprovalWorkflow() {
  const { t } = useTranslation();

  const history = mockApprovalHistory;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {t("approvalWorkflow.approvalHistory")}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Review the progress of approvals and actions taken.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
          <Clock className="w-4 h-4" />
          In Progress
        </span>
      </div>

      {/* Timeline */}
      <div className="p-6">
        <div className="space-y-6">
          {history.map((item, index) => {
            const isApproved = item.status === "approved";
            const isRejected = item.status === "rejected";
            const isProgress = item.status === "in_progress";

            return (
              <div
                key={item.step}
                className="relative flex gap-4 group"
              >
                {/* Timeline Column */}
                <div className="relative flex flex-col items-center">
                  <div
                    className={`
                      w-11 h-11 rounded-xl flex items-center justify-center
                      transition-all duration-200
                      group-hover:scale-105
                      ${
                        isApproved
                          ? "bg-green-100"
                          : isRejected
                          ? "bg-red-100"
                          : isProgress
                          ? "bg-yellow-100"
                          : "bg-slate-100"
                      }
                    `}
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
                    <div
                      className={`
                        w-0.5 flex-1 min-h-16 mt-2
                        ${
                          isApproved
                            ? "bg-green-200"
                            : isRejected
                            ? "bg-red-200"
                            : "bg-slate-200"
                        }
                      `}
                    />
                  )}
                </div>

                {/* Content Card */}
                <div
                  className="
                    flex-1
                    border border-slate-200
                    rounded-xl
                    p-4
                    transition-all
                    duration-200
                    hover:shadow-md
                    hover:border-slate-300
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {item.role}
                      </h4>

                      <p className="text-sm text-slate-500 mt-1">
                        {item.user}
                      </p>
                    </div>

                    <span
                      className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${
                          isApproved
                            ? "bg-green-100 text-green-700"
                            : isRejected
                            ? "bg-red-100 text-red-700"
                            : isProgress
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-600"
                        }
                      `}
                    >
                      {item.action}
                    </span>
                  </div>

                  {item.comment && (
                    <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="text-sm italic text-slate-600">
                        "{item.comment}"
                      </p>
                    </div>
                  )}

                  {item.date && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      {item.date}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ApprovalWorkflow;