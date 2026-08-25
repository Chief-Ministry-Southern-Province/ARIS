import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import FR104_3Form from "@/components/pages/forms/FR103_3/FR104_3Form";
import FR104_4Form from "@/components/pages/forms/FR104_4/FR104_4Form";
import FR109Form from "@/components/pages/forms/FR109/FR109Form";
import ApprovalDecisionDialog from "@/components/approval/ApprovalDecisionDialog";
import Loader from "@/components/atoms/Loader";
import Modal from "@/components/molecules/Modal";
import {
  useApprovalDocument,
  useApprovalHistory,
  useApprove,
  useReject,
} from "@/hooks/useApprovals";

type Decision = "approve" | "reject" | null;

export default function ApprovalDocumentViewer() {
  const { t } = useTranslation();
  const { approvalId } = useParams();
  const navigate = useNavigate();

  const approvalIdNumber = Number(approvalId);

  const [isDecisionPickerOpen, setIsDecisionPickerOpen] = useState(false);
  const [decision, setDecision] = useState<Decision>(null);

  const {
    data: document,
    isLoading,
    error,
  } = useApprovalDocument(approvalIdNumber);

  const { data: approvalGroups = [] } = useApprovalHistory(
    document?.case?.id ?? 0,
    document?.document_type,
    document?.revision
  );

  const approveMutation = useApprove(document?.case?.id);
  const rejectMutation = useReject(document?.case?.id);

  const approvals = approvalGroups.flatMap((group) => group.approvals);

  const approval = approvals.find((item) => item.id === approvalIdNumber);

  const canDecide = approval?.status === "PENDING";
  const isFinalStep = approval?.step === Math.max(...approvals.map((item) => item.step));
  const approvalActionLabel = isFinalStep ? "Approve" : "Recommend";

  if (isLoading) {
    return <Loader text={t("approvalCenter.loadingApprovalDocument")} />;
  }

  if (error || !document) {
    return (
      <div className="rounded-2xl border border-[#1565C0]/20 bg-blue-50 p-6 text-[#0F4C81] shadow-sm">
        <h2 className="mb-2 text-lg font-semibold">
          {t("approvalCenter.unableToLoadDocument")}
        </h2>

        <p className="text-sm text-slate-600">
          {t("approvalCenter.unableToLoadDocumentDescription")}
        </p>
      </div>
    );
  }

  const chooseDecision = (action: Exclude<Decision, null>) => {
    setIsDecisionPickerOpen(false);
    setDecision(action);
  };

  const submitDecision = async (comments: string) => {
    if (!decision) return;

    try {
      if (decision === "approve") {
        await approveMutation.mutateAsync({
          id: approvalIdNumber,
          comments: comments || undefined,
        });

        toast.success(
          isFinalStep
            ? t("approvalCenter.documentApprovedSuccessfully")
            : t("approvalCenter.documentRecommendedSuccessfully"),
        );
      } else {
        await rejectMutation.mutateAsync({
          id: approvalIdNumber,
          comments,
        });

        toast.success(t("approvalCenter.documentReturnedForChanges"));
      }

      navigate("/approvals");
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || t("approvalCenter.unableToUpdateApproval")
      );
    }
  };

  const decisionProps = canDecide
    ? {
        onDecision: () => setIsDecisionPickerOpen(true),
      }
    : {};

  const form = document.document_type === "FR109" ? (
    <FR109Form
      readOnly
      document={document}
      approvalTimeline={approvals}
      onBack={() => navigate("/approvals")}
      canCompleteChiefAccountingOrder={canDecide}
      canCompleteChiefSecretaryDecision={canDecide}
      {...decisionProps}
    />
  ) : document.document_type === "FR1044" ? (
      <FR104_4Form
        readOnly
        document={document}
        approvalTimeline={approvals}
        onBack={() => navigate("/approvals")}
        {...decisionProps}
      />
    ) : (
      <FR104_3Form
        readOnly
        document={document}
        approvalTimeline={approvals}
        onBack={() => navigate("/approvals")}
        {...decisionProps}
      />
    );

  return (
    <>
      {form}

      {isDecisionPickerOpen && (
        <Modal onClose={() => setIsDecisionPickerOpen(false)}>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-semibold text-[#0F4C81]">
                {t("approvalCenter.approvalDecision")}
              </h2>

              <p className="mt-2 text-sm text-slate-600">
                {t("approvalCenter.reviewBeforeDecision")}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => chooseDecision("approve")}
                className="flex-1 rounded-xl bg-[#0F4C81] px-5 py-3 font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#1565C0] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-2"
              >
                {t("approvalCenter.actionDocument", {
                  action: approvalActionLabel === "Approve"
                    ? t("approvalCenter.approve")
                    : t("approvalCenter.recommend"),
                })}
              </button>

              <button
                type="button"
                onClick={() => chooseDecision("reject")}
                className="flex-1 rounded-xl border-2 border-[#0F4C81] bg-white px-5 py-3 font-semibold text-[#0F4C81] transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#1565C0] focus:ring-offset-2"
              >
                {t("approvalCenter.returnForChanges")}
              </button>
            </div>

            {/* Cancel */}
            <button
              type="button"
              onClick={() => setIsDecisionPickerOpen(false)}
              className="w-full rounded-xl border border-slate-300 bg-white py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100"
            >
              {t("approvalCenter.cancel")}
            </button>
          </div>
        </Modal>
      )}

      {decision && approval && (
        <ApprovalDecisionDialog
          approval={approval}
          action={decision}
          approvalActionLabel={approvalActionLabel}
          isPending={
            approveMutation.isPending || rejectMutation.isPending
          }
          onClose={() => setDecision(null)}
          onConfirm={submitDecision}
        />
      )}
    </>
  );
}
