import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, Printer, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import Loader from "@/components/atoms/Loader";
import GeneralInformationSection from "@/components/organisms/Forms/FR104_4/GeneralInformationSection";
import LossDetailsSection from "@/components/organisms/Forms/FR104_4/LossDetailsSection";
import CauseOfLossSection from "@/components/organisms/Forms/FR104_4/CauseOfLossSection";
import LostItemsSection from "@/components/organisms/Forms/FR104_4/LostItemSection";
import OfficersResponsibleSection from "@/components/organisms/Forms/FR104_4/OfficersResponsibleSection";
import PoliceInformationSection from "@/components/organisms/Forms/FR104_4/PoliceInformationSection";
import InvestigationSection from "@/components/organisms/Forms/FR104_4/InvestigationSection";
import RecoveryInformationSection from "@/components/organisms/Forms/FR104_4/RecoveryInformationSection";
import InsuranceInformationSection from "@/components/organisms/Forms/FR104_4/InsuranceInformationSection";
import BoardOfInquirySection from "@/components/organisms/Forms/FR104_4/BoardOfInquirySection";
import RecommendationsSection from "@/components/organisms/Forms/FR104_4/RecommendationsSection";
import LegalActionSection from "@/components/organisms/Forms/FR104_4/LegalActionSection";
import PreventiveActionsSection from "@/components/organisms/Forms/FR104_4/PreventiveActionsSection";
import { initialFormData } from "./initialFormData";
import { useGetFR1044, useSaveFR1044, useSubmitFR1044 } from "@/hooks/useFR1044";
import { useGetFR1043 } from "@/hooks/useFR1043";
import { uploadFR1044Attachment } from "@/services/fr1044.service";
import type {
  FR104_4FormData,
  FR1044Response,
  FR1044Status,
} from "@/types/FR104_4_types";
import type { Approval } from "@/types/approval.type";

interface Props {
  readOnly?: boolean;
  document?: FR1044Response;
  approvalTimeline?: Approval[];
  onBack?: () => void;
}

const badge: Record<FR1044Status, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_APPROVAL: "bg-yellow-100 text-yellow-800",
  CHANGES_REQUESTED: "bg-red-100 text-red-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
};

export default function FR104_4Form({
  readOnly = false,
  document,
  approvalTimeline = [],
  onBack,
}: Props) {
  const { t } = useTranslation();
  const { caseId } = useParams();
  const accidentCaseId = Number(caseId);

  const { data: loaded, isLoading, error } = useGetFR1044(
    readOnly ? undefined : accidentCaseId
  );
  const { data: preliminaryReport, isLoading: preliminaryReportLoading } = useGetFR1043(
    readOnly ? undefined : accidentCaseId
  );
  const { saveFR1044, loading: saving } = useSaveFR1044(accidentCaseId);
  const submit = useSubmitFR1044(accidentCaseId);

  const displayed = document ?? loaded;

  const [data, setData] = useState<FR104_4FormData>(initialFormData);
  const [id, setId] = useState<number | null>(null);
  const [status, setStatus] = useState<FR1044Status | null>(null);

  const editable =
    !readOnly && (!status || ["DRAFT", "CHANGES_REQUESTED"].includes(status));

  const currentApproval =
    approvalTimeline.find((item) => item.status === "PENDING") ??
    approvalTimeline.at(-1);

  useEffect(() => {
    if (displayed) {
      setData(displayed.data);
      setId(displayed.id);
      setStatus(displayed.status);
    }
  }, [displayed]);

  useEffect(() => {
    if (displayed || !preliminaryReport) return;

    setData((previous) => ({
      ...previous,
      preliminaryReportRefNo: preliminaryReport.reference_number,
      preliminaryReportDate:
        preliminaryReport.data.date ||
        preliminaryReport.submitted_at?.slice(0, 10) ||
        "",
    }));
  }, [displayed, preliminaryReport]);

  useEffect(() => {
    if (error && (error as { response?: { status?: number } }).response?.status !== 404) {
      toast.error("There was no 104(4) form found.");
    }
  }, [error]);

  const handleChange = (field: string, value: string | File | null) =>
    setData((previous) => ({ ...previous, [field]: value }));

  const payloadData = (): FR104_4FormData => ({
    ...data,
    policeReportFile:
      data.policeReportFile instanceof File
        ? data.policeReportFile.name
        : data.policeReportFile,
    courtOrderFile:
      data.courtOrderFile instanceof File
        ? data.courtOrderFile.name
        : data.courtOrderFile,
    boardReportFile:
      data.boardReportFile instanceof File
        ? data.boardReportFile.name
        : data.boardReportFile,
  });

  const save = async () => {
    if (!Number.isInteger(accidentCaseId) || accidentCaseId <= 0) {
      toast.error("Invalid accident case.");
      return null;
    }

    try {
      let result = await saveFR1044(id, status, payloadData());

      const attachments = [
        ["policeReportFile", "policeReportEvidenceId"],
        ["courtOrderFile", "courtOrderEvidenceId"],
        ["boardReportFile", "boardReportEvidenceId"],
      ] as const;

      let updatedData = result.data;

      for (const [fileKey, evidenceKey] of attachments) {
        const file = data[fileKey];
        if (!(file instanceof File)) continue;

        const evidence = await uploadFR1044Attachment(result.id, file, fileKey);
        updatedData = {
          ...updatedData,
          [fileKey]: evidence.original_name,
          [evidenceKey]: evidence.id,
        };
      }

      if (updatedData !== result.data) {
        result = await saveFR1044(result.id, "DRAFT", updatedData);
      }

      setData(updatedData);
      setId(result.id);
      setStatus(result.status);
      toast.success("FR104(4) draft saved successfully.");
      return result;
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || "Failed to save FR104(4) draft."
      );
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const draft = await save();
    if (!draft) return;

    try {
      const result = await submit.mutateAsync(draft.id);
      setStatus(result.status);
    } catch (reason: unknown) {
      toast.error(
        (reason as { response?: { data?: { message?: string } } }).response
          ?.data?.message || "Failed to submit FR104(4) form."
      );
    }
  };

  if (!readOnly && isLoading) return <Loader text="Loading FR104(4) form..." />;

  const cards = [
    ["a", "generalInformation", <GeneralInformationSection formData={data} handleChange={handleChange} isPreliminaryLoading={preliminaryReportLoading} />],
    ["b", "lossDetails", <LossDetailsSection formData={data} handleChange={handleChange} />],
    ["c", "causeOfLoss", <CauseOfLossSection formData={data} handleChange={handleChange} />],
    ["d", "policeInformation", <PoliceInformationSection formData={data} handleChange={handleChange} />],
    ["e", "lostItems", <LostItemsSection formData={data} setFormData={setData} />],
    ["f", "responsibleOfficers", <OfficersResponsibleSection formData={data} setFormData={setData} />],
    ["g", "legalAction", <LegalActionSection formData={data} handleChange={handleChange} />],
    ["h", "investigation", <InvestigationSection formData={data} handleChange={handleChange} />],
    ["i", "recoveryInformation", <RecoveryInformationSection formData={data} setFormData={setData} />],
    ["j", "insuranceInformation", <InsuranceInformationSection formData={data} handleChange={handleChange} />],
    ["k", "boardOfInquiry", <BoardOfInquirySection formData={data} setFormData={setData} />],
    ["l", "recommendations", <RecommendationsSection handleChange={handleChange} />],
    ["m", "preventiveActions", <PreventiveActionsSection formData={data} handleChange={handleChange} />],
  ] as const;

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">
          <div className="bg-blue-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              {t("fr104_4.title")}
            </h1>
            <p className="text-blue-200 mt-2">{t("fr104_4.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-8 py-4">
            <div>
              <p className="text-xs text-slate-500">
                {t("fr104_4.generalInformation.referenceNo")}
              </p>
              <p className="font-semibold">
                {displayed?.reference_number || data.referenceNo || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                {t("fr104_4.meta.revisionLabel")}
              </p>
              <p className="font-semibold">
                {t("fr104_4.meta.revisionValue")} {displayed?.revision ?? 1}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500">
                {t("fr104_4.meta.statusLabel")}
              </p>
              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  badge[status ?? "DRAFT"]
                }`}
              >
                {t(`fr104_4.meta.status.${status ?? "DRAFT"}`)}
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
            {cards.map(([part, section, content]) => (
              <FormCard
                key={part}
                part={t(`fr104_4.parts.${part}`)}
                title={
                  section === "preventiveActions"
                    ? t("fr104_4.preventiveActions.title")
                    : t(`fr104_4.sections.${section}`)
                }
              >
                {content}
              </FormCard>
            ))}
          </fieldset>

          <div className="sticky bottom-0 bg-white border-t shadow-lg p-4">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              {readOnly ? (
                <button
                  type="button"
                  onClick={onBack}
                  className="px-5 py-3 border rounded-lg"
                >
                  Back
                </button>
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
      </div>
    </div>
  );
}