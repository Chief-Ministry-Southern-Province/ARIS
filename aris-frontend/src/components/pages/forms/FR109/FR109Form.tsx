import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, Printer, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import Loader from "@/components/atoms/Loader";
import { initialFormData } from "./initialFormData";
import { useGetFR109, useSaveFR109, useSubmitFR109, useUpdateFR109WriteOff, useUpdateFR109ChiefAccountingOrder, useUpdateFR109ChiefSecretaryDecision } from "@/hooks/useFR109";
import { useAuth } from "@/context/auth/AuthContext";
import type { FR109FormData, FR109Response, FR109Status } from "@/types/FR109.type";
import type { Approval } from "@/types/approval.type";
import DocumentApprovalSignatures from "@/components/organisms/Forms/DocumentApprovalSignatures";
import DepartmentSection from "@/components/organisms/Forms/FR109/DepartmentSection";
import ReportSection from "@/components/organisms/Forms/FR109/ReportSection";
import PropertySection from "@/components/organisms/Forms/FR109/PropertySection";
import ValueOfLossSection from "@/components/organisms/Forms/FR109/ValueOfLossSection";
import NonRecoverySection from "@/components/organisms/Forms/FR109/NonRecoverySection";
import LegalActionSection from "@/components/organisms/Forms/FR109/LegalActionSection";
import WriteOffRegisterSection from "@/components/organisms/Forms/FR109/WriteOffRegisterSection";
import HeadOfDepartmentOrderSection from "@/components/organisms/Forms/FR109/HeadOfDepartmentOrderSection";
import ChiefAccountingOfficerOrderSection from "@/components/organisms/Forms/FR109/ChiefAccountingOfficerOrderSection";
import WriteOffDecisionSection from "@/components/organisms/Forms/FR109/WriteOffDecisionSection";

interface Props {
  readOnly?: boolean;
  document?: FR109Response;
  approvalTimeline?: Approval[];
  onBack?: () => void;
  onDecision?: () => void;
  canCompleteChiefAccountingOrder?: boolean;
  canCompleteChiefSecretaryDecision?: boolean;
}

type LegacyWriteOffFields = {
  stockBookFolio?: string;
  inventoryBookFolio?: string;
  fixedAssetsRegisterFolio?: string;
  ledgerFolio?: string;
};

const badge: Record<FR109Status, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_APPROVAL: "bg-yellow-100 text-yellow-800",
  CHANGES_REQUESTED: "bg-red-100 text-red-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
};

export default function FR109Form({
  readOnly = false,
  document,
  approvalTimeline = [],
  onBack,
  onDecision,
  canCompleteChiefAccountingOrder = false,
  canCompleteChiefSecretaryDecision = false,
}: Props) {
  const { t } = useTranslation();
  const { id: currentUserId, role, institutionType } = useAuth();
  const { caseId } = useParams();
  const accidentCaseId = Number(caseId);

  const { data: loaded, isLoading, error } = useGetFR109(
    readOnly ? "" : (caseId ?? "")
  );
  const { mutateAsync: saveFR109, isPending: saving } = useSaveFR109(caseId ?? "");
  const submit = useSubmitFR109(caseId ?? "");
  const writeOff = useUpdateFR109WriteOff(caseId ?? "");
  const chiefAccountingOrder = useUpdateFR109ChiefAccountingOrder(
    caseId ?? String(document?.case.id ?? ""),
  );
  const chiefSecretaryDecision = useUpdateFR109ChiefSecretaryDecision(
    caseId ?? String(document?.case.id ?? ""),
  );

  const displayed = document ?? loaded;

  const [data, setData] = useState<FR109FormData>(initialFormData);
  const [status, setStatus] = useState<FR109Status | null>(null);

  const editable =
    !readOnly && (!status || ["DRAFT", "CHANGES_REQUESTED"].includes(status));
  const writeOffEditable =
    !readOnly &&
    status === "APPROVED" &&
    displayed?.creator.id === currentUserId;
  const ministryRecommendationEditable =
    editable &&
    role.includes("subject_officer") &&
    institutionType === "PDHS";
  const chiefAccountingOrderEditable =
    (!readOnly || canCompleteChiefAccountingOrder) &&
    status === "UNDER_APPROVAL" &&
    role.includes("subject_officer") &&
    institutionType === "MINISTRY";
  const chiefSecretaryDecisionEditable =
    (!readOnly || canCompleteChiefSecretaryDecision) &&
    status === "UNDER_APPROVAL" &&
    role.includes("chief_secretary");

  const currentApproval =
    approvalTimeline.find((item) => item.status === "PENDING") ??
    approvalTimeline.at(-1);

  useEffect(() => {
    if (displayed) {
      const formData = displayed.data as FR109FormData & LegacyWriteOffFields;
      const {
        stockBookFolio,
        inventoryBookFolio,
        fixedAssetsRegisterFolio,
        ledgerFolio,
        ...currentData
      } = formData;
      const legacyEntry = {
        stockBookFolio: stockBookFolio ?? "",
        inventoryBookFolio: inventoryBookFolio ?? "",
        fixedAssetsRegisterFolio: fixedAssetsRegisterFolio ?? "",
        ledgerFolio: ledgerFolio ?? "",
      };
      const hasLegacyEntry = Object.values(legacyEntry).some(Boolean);

      setData({
        ...initialFormData,
        ...currentData,
        writeOffEntries: formData.writeOffEntries?.length
          ? formData.writeOffEntries
          : hasLegacyEntry
            ? [legacyEntry]
            : initialFormData.writeOffEntries,
      });
      setStatus(displayed.status);
    }
  }, [displayed]);

  useEffect(() => {
    if (error && (error as { response?: { status?: number } }).response?.status !== 404) {
      toast.error("Failed to load FR109 form.");
    }
  }, [error]);

  const save = async () => {
    if (!Number.isInteger(accidentCaseId) || accidentCaseId <= 0) {
      toast.error("Invalid accident case.");
      return null;
    }

    try {
      const result = await saveFR109(data);
      setData(result.data);
      setStatus(result.status);
      toast.success("FR109 draft saved successfully.");
      return result;
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || "Failed to save FR109 draft."
      );
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const draft = await save();
    if (!draft) return;

    try {
      const result = await submit.mutateAsync(draft.data);
      setStatus(result.status);
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || "Failed to submit FR109 form."
      );
    }
  };

  const saveWriteOff = async () => {
    if (!displayed?.id) return;

    try {
      const result = await writeOff.mutateAsync({
        fr109Id: displayed.id,
        writeOffEntries: data.writeOffEntries,
      });
      setData(result.data);
      setStatus(result.status);
      toast.success("Write-off register saved successfully.");
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || "Failed to save write-off register."
      );
    }
  };

  const saveChiefAccountingOrder = async () => {
    if (!displayed?.id) return;

    try {
      const result = await chiefAccountingOrder.mutateAsync({
        fr109Id: displayed.id,
        stNo: data.chiefAccountingOfficerSTNo,
        refNo: data.chiefAccountingOfficerRefNo,
      });
      setData(result.data);
      setStatus(result.status);
      toast.success("Chief Accounting Officer order saved successfully.");
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || "Failed to save Chief Accounting Officer order."
      );
    }
  };

  const saveChiefSecretaryDecision = async () => {
    if (!displayed?.id || !data.writeOffStatus) return;

    try {
      const result = await chiefSecretaryDecision.mutateAsync({
        fr109Id: displayed.id,
        secretaryToMinistryOf: data.chiefSecretaryToMinistryOf,
        refNo: data.chiefSecretaryRefNo,
        writeOffStatus: data.writeOffStatus,
      });
      setData(result.data);
      setStatus(result.status);
      toast.success("Write-off decision saved successfully.");
    } catch (reason: unknown) {
      toast.error((reason as { response?: { data?: { message?: string } } }).response?.data?.message || "Failed to save write-off decision.");
    }
  };

  if (!readOnly && isLoading) return <Loader text="Loading FR109 form..." />;

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
          <div className="bg-blue-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">{t("fr109.title")}</h1>
            <p className="text-blue-200 mt-2">{t("fr109.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-8 py-4">
            <div>
              <p className="text-xs text-slate-500">{t("fr109.meta.refNo")}</p>
              <p className="font-semibold">
                {displayed?.reference_number || data.refNo || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">{t("fr109.meta.revisionLabel")}</p>
              <p className="font-semibold">
                {t("fr109.meta.revisionValue")} {displayed?.revision ?? 1}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">{t("fr109.meta.statusLabel")}</p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  badge[status ?? "DRAFT"]
                }`}
              >
                {t(`fr109.meta.status.${status ?? "DRAFT"}`)}
              </span>
            </div>
          </div>
        </div>

        {readOnly && (
          <div className="mb-8 grid gap-4 rounded-2xl border bg-white p-5 text-sm md:grid-cols-3">
            <div>
              Submitted:{" "}
              {displayed?.submitted_at
                ? new Date(displayed.submitted_at).toLocaleString()
                : "—"}
            </div>
            <div>
              Current approval:{" "}
              {currentApproval
                ? `Step ${currentApproval.step} — ${currentApproval.status}`
                : "—"}
            </div>
            <div>{approvalTimeline.length} approval steps</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          <fieldset disabled={!editable} className="space-y-8 disabled:opacity-70">
            <DepartmentSection
              formData={data}
              setFormData={setData}
            />

            <ReportSection
              formData={data}
              setFormData={setData}
            />

            <PropertySection
              formData={data}
              setFormData={setData}
            />

            <ValueOfLossSection
              formData={data}
              setFormData={setData}
            />

            <LegalActionSection
              formData={data}
              setFormData={setData}
            />

            <NonRecoverySection
              formData={data}
              setFormData={setData}
            />

          </fieldset>

          <fieldset disabled={!ministryRecommendationEditable} className="space-y-8 disabled:opacity-70">
            <HeadOfDepartmentOrderSection
              formData={data}
              setFormData={setData}
            />
          </fieldset>

          <fieldset disabled={!chiefAccountingOrderEditable} className="space-y-8 disabled:opacity-70">
            <ChiefAccountingOfficerOrderSection
              formData={data}
              setFormData={setData}
            />
          </fieldset>

          <fieldset disabled={!chiefSecretaryDecisionEditable} className="space-y-8 disabled:opacity-70">
            <WriteOffDecisionSection formData={data} setFormData={setData} />
          </fieldset>

          <fieldset disabled={!writeOffEditable} className="space-y-8 disabled:opacity-70">
            <WriteOffRegisterSection
              formData={data}
              setFormData={setData}
            />
          </fieldset>

          <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              {readOnly ? (
                <>
                  <button
                    type="button"
                    onClick={onBack}
                    className="px-5 py-3 border rounded-lg"
                  >
                    Back
                  </button>
                  {onDecision && (
                    <button
                      type="button"
                      onClick={onDecision}
                      className="px-5 py-3 bg-blue-800 text-white rounded-lg"
                    >
                      Decision
                    </button>
                  )}
                </>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={!editable || saving || submit.isPending}
                    className="px-6 py-3 bg-blue-800 text-white rounded-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    {submit.isPending
                      ? "Submitting..."
                      : status === "CHANGES_REQUESTED" ||
                        (displayed?.revision ?? 1) > 1
                      ? "Submit Again"
                      : "Submit"}
                  </button>

                  <button
                    type="button"
                    onClick={save}
                    disabled={!editable || saving || submit.isPending}
                    className="px-5 py-3 border rounded-lg flex items-center justify-center gap-2"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Draft"}
                  </button>

                  {writeOffEditable && (
                    <button
                      type="button"
                      onClick={saveWriteOff}
                      disabled={writeOff.isPending}
                      className="px-5 py-3 border rounded-lg flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {writeOff.isPending ? "Saving..." : "Save Write-Off Details"}
                    </button>
                  )}

                  {chiefAccountingOrderEditable && (
                    <button
                      type="button"
                      onClick={saveChiefAccountingOrder}
                      disabled={chiefAccountingOrder.isPending}
                      className="px-5 py-3 border rounded-lg flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      {chiefAccountingOrder.isPending ? "Saving..." : "Save S.T. / Ref. No."}
                    </button>
                  )}

                  {chiefSecretaryDecisionEditable && (
                    <button type="button" onClick={saveChiefSecretaryDecision} disabled={chiefSecretaryDecision.isPending || !data.writeOffStatus} className="px-5 py-3 border rounded-lg flex items-center justify-center gap-2">
                      <Save size={18} />
                      {chiefSecretaryDecision.isPending ? "Saving..." : "Save Write-Off Decision"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-5 py-3 border rounded-lg flex items-center justify-center gap-2"
                  >
                    <Printer size={18} />
                    Print
                  </button>
                </>
              )}
            </div>
          </div>
        </form>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <DocumentApprovalSignatures approvals={approvalTimeline} />
        </div>
        
      </div>
    </div>
  );
}
