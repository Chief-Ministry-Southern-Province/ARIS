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
  const [action, setAction] = useState<"approve" | "reject" | "changes">("approve");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">{t("approvalWorkflow.approvalDecision")}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{step.role} — {step.title}</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: "approve" as const, label: t("approvalWorkflow.approve"), color: "border-green-500 bg-green-50 text-green-700" },
              { val: "reject" as const, label: t("approvalWorkflow.reject"), color: "border-red-500 bg-red-50 text-red-700" },
              { val: "changes" as const, label: t("approvalWorkflow.requestChanges"), color: "border-yellow-500 bg-yellow-50 text-yellow-700" },
            ].map(({ val, label, color }) => (
              <button key={val} onClick={() => setAction(val)}
                className={`py-2.5 px-3 rounded-lg border-2 text-xs font-semibold transition-colors ${action === val ? color : "border-gray-200 text-gray-500 hover:border-gray-300"}`}>
                {label}
              </button>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">{t("approvalWorkflow.comments")}</label>
            <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("approvalWorkflow.commentsPlaceholder")}
              value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={() => onClose("", "")} className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t("approvalWorkflow.cancel")}
          </button>
          <button onClick={() => onClose(action, comment)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90
              ${action === "approve" ? "bg-green-600" : action === "reject" ? "bg-red-600" : "bg-yellow-600"}`}>
            {action === "approve" ? t("approvalWorkflow.approve") :
              action === "reject" ? t("approvalWorkflow.reject") :
                t("approvalWorkflow.requestChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActionModal;