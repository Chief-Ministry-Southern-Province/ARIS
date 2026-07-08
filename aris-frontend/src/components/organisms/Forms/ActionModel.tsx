import { useState } from "react";
import type { approvalWorkflowStep } from "@/types/approvalWorkflow.type";
import type { TFunction } from "node_modules/i18next/typescript/t";

interface ActionModalProps {
  step: approvalWorkflowStep;
  onClose: (action: string, comment: string) => void;
  t: TFunction;
}

function ActionModal({ step, onClose, t }: ActionModalProps) {
  const [comment, setComment] = useState("");
  const [action, setAction] = useState<
    "approve" | "reject" | "changes"
  >("approve");

  const actions = [
    {
      val: "approve" as const,
      label: t("approvalWorkflow.approve"),
      activeClass:
        "border-blue-600 bg-blue-50 text-blue-700",
    },
    {
      val: "reject" as const,
      label: t("approvalWorkflow.reject"),
      activeClass:
        "border-slate-600 bg-slate-50 text-slate-700",
    },
    {
      val: "changes" as const,
      label: t("approvalWorkflow.requestChanges"),
      activeClass:
        "border-indigo-600 bg-indigo-50 text-indigo-700",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="bg-blue-50 border-b border-blue-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-blue-900">
            {t("approvalWorkflow.approvalDecision")}
          </h3>

          <p className="mt-1 text-xs text-blue-600">
            {step.role} — {step.title}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-5 p-6">

          {/* Action Selection */}
          <div className="grid grid-cols-3 gap-2">
            {actions.map(({ val, label, activeClass }) => (
              <button
                key={val}
                type="button"
                onClick={() => setAction(val)}
                className={`rounded-lg border-2 px-3 py-2.5 text-xs font-semibold transition-all duration-200
                  ${
                    action === val
                      ? activeClass
                      : "border-gray-200 text-gray-500 hover:border-blue-300 hover:text-blue-600"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Comment */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {t("approvalWorkflow.comments")}
            </label>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t(
                "approvalWorkflow.commentsPlaceholder"
              )}
              className="
                w-full rounded-lg border border-gray-300
                px-3 py-2 text-sm
                focus:border-blue-500
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500/20
              "
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={() => onClose("", "")}
            className="
              flex-1 rounded-lg border border-gray-300
              px-4 py-2.5 text-sm font-medium text-gray-700
              transition-colors hover:bg-gray-50
            "
          >
            {t("approvalWorkflow.cancel")}
          </button>

          <button
            type="button"
            onClick={() => onClose(action, comment)}
            className="
              flex-1 rounded-lg bg-blue-800
              px-4 py-2.5 text-sm font-medium text-white
              transition-colors hover:bg-blue-900
            "
          >
            {action === "approve"
              ? t("approvalWorkflow.approve")
              : action === "reject"
              ? t("approvalWorkflow.reject")
              : t("approvalWorkflow.requestChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;