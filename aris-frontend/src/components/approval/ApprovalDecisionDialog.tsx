import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "@/components/molecules/Modal";
import type { Approval } from "@/types/approval.type";

interface ApprovalDecisionDialogProps {
  approval: Approval;
  action: "approve" | "reject";
  approvalActionLabel: "Recommend" | "Approve";
  isPending: boolean;
  onClose: () => void;
  onConfirm: (comments: string) => Promise<void>;
}

export default function ApprovalDecisionDialog({
  approval,
  action,
  approvalActionLabel,
  isPending,
  onClose,
  onConfirm,
}: ApprovalDecisionDialogProps) {
  const { t } = useTranslation();
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");
  const isReject = action === "reject";

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isReject && !comments.trim()) {
      setError(t("approvalCenter.rejectionReasonRequired"));
      return;
    }

    setError("");
    await onConfirm(comments.trim());
  };

  return (
    <Modal onClose={isPending ? () => undefined : onClose}>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            {isReject
              ? t("approvalCenter.rejectApproval")
              : t("approvalCenter.actionDocument", {
                  action: approvalActionLabel === "Approve"
                    ? t("approvalCenter.approve")
                    : t("approvalCenter.recommend"),
                })}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {approval.reference_number} · {t("approvalCenter.revision", { number: approval.revision })}
          </p>
        </div>

        <div>
          <label htmlFor="approval-comments" className="mb-2 block text-sm font-medium text-slate-700">
            {isReject
              ? t("approvalCenter.rejectionReason")
              : t("approvalCenter.commentsOptional")}
          </label>
          <textarea
            id="approval-comments"
            value={comments}
            onChange={(event) => setComments(event.target.value)}
            required={isReject}
            maxLength={1000}
            disabled={isPending}
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/20 disabled:bg-slate-100"
          />
          {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isPending} className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50">
            {t("approvalCenter.cancel")}
          </button>
          <button type="submit" disabled={isPending} className={`rounded-lg px-4 py-2 text-sm text-white disabled:opacity-50 ${isReject ? "bg-red-600 hover:bg-red-700" : "bg-[#0F4C81] hover:bg-[#0B3C66]"}`}>
            {isPending
              ? t("approvalCenter.saving")
              : isReject
                ? t("approvalCenter.reject")
                : approvalActionLabel === "Approve"
                  ? t("approvalCenter.approve")
                  : t("approvalCenter.recommend")}
          </button>
        </div>
      </form>
    </Modal>
  );
}
