import {useEffect, useState} from "react";
import type { FR1043FormData , LostItem , Officer } from "@/types/form_104_3_types";
import GeneralInformationSection from "@/components/organisms/Forms/FR104_3/GeneralInformationSection";
import PoliceInformationSection from "@/components/organisms/Forms/FR104_3/PoliceInformationSection";
import NatureOfLossSection from "@/components/organisms/Forms/FR104_3/NatureOfLossSection";
import LostItemsSection from "@/components/organisms/Forms/FR104_3/LostItemsSection";
import CauseOfLossSection from "@/components/organisms/Forms/FR104_3/CauseOfLossSection";
import OfficersSection from "@/components/organisms/Forms/FR104_3/OfficersSection";
import InvestigationSection from "@/components/organisms/Forms/FR104_3/InvestigationSection";
import SecurityArrangementSection from "@/components/organisms/Forms/FR104_3/SecurityArrangementSection";
import PreventionArrangementSection from "@/components/organisms/Forms/FR104_3/PreventionArrangementSection";
import { useTranslation } from "react-i18next";
import {FormCard} from "@/components/molecules/FormCard";
import { CheckCircle, Download, Eye, Save, Printer } from "lucide-react";
import type { approvalWorkflowStep } from "@/types/approvalWorkflow.type";
import ActionModal from "@/components/organisms/Forms/ActionModel";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDownloadFR1043Pdf, useGetFR1043, useSaveFR1043, useSubmitFR1043 } from "@/hooks/useFR1043";
import { useApprovalHistory } from "@/hooks/useApprovals";
import type { FR1043Response, FR1043Status } from "@/types/form_104_3_types";
import Loader from "@/components/atoms/Loader";
import type { Approval } from "@/types/approval.type";
import DocumentApprovalSignatures from "@/components/organisms/Forms/DocumentApprovalSignatures";
import PdfPreviewModal from "@/components/organisms/PDF/PdfPreviewModal";

interface FR1043FormProps {
  readOnly?: boolean;
  document?: FR1043Response;
  approvalTimeline?: Approval[];
  onBack?: () => void;
  onDecision?: () => void;
}

const FR104_3Form = ({ readOnly = false, document, approvalTimeline = [], onBack, onDecision }: FR1043FormProps) => {


  const { caseId } = useParams();
  const accidentCaseId = Number(caseId);

  const { t } = useTranslation();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [formId, setFormId] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<FR1043Status | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: loadedForm, isLoading: loadingForm, error: loadError } = useGetFR1043(readOnly ? undefined : accidentCaseId);
  const displayedForm = document ?? loadedForm;
  const { saveFR1043, loading: saving } = useSaveFR1043(accidentCaseId);
  const submitMutation = useSubmitFR1043(accidentCaseId);
  const downloadPdfMutation = useDownloadFR1043Pdf();
  const { data: approvalGroups = [] } = useApprovalHistory(
    readOnly ? 0 : accidentCaseId,
    "FR1043",
    displayedForm?.revision,
  );
  const submitting = submitMutation.isPending;
  const isEditable = !readOnly && (!formStatus || ["DRAFT", "CHANGES_REQUESTED"].includes(formStatus));
  const generatedApprovalTimeline = displayedForm
    ? approvalGroups
      .filter((group) => group.revision === displayedForm.revision)
      .flatMap((group) => group.approvals)
    : [];
  const resolvedApprovalTimeline = approvalTimeline.length > 0
    ? approvalTimeline
    : generatedApprovalTimeline;
  const currentApproval = resolvedApprovalTimeline.find((approval) => approval.status === "PENDING") ?? resolvedApprovalTimeline.at(-1);

  const [formData, setFormData] = useState<FR1043FormData>({
    department: "",
    secretaryOfMinistry: "",
    date: "",
    place: "",

    natureOfLoss: "",
    causeOfLoss: "",

    policeStation: "",
    policeReportDate: "",

    investigation: "",
    securityArrangements: "",
    preventionArrangements: "",

    items: [],
    officers: [],
    preparedBy: "",
    preparedDesignation: "",
    preparedSignature: null,
    preparedDate: "",
    headName: "",
    headDesignation: "",
    headSignature: null,
    headApprovalDate: "",
    secretaryName: "",
    secretaryDesignation: "",
    secretarySignature: null,
    secretaryApprovalDate: "",
  });

  useEffect(() => () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          description: "",
          quantity: "",
          unit: "",
          value: "",
        },
      ],
    }));
  };

  const updateItem = (index: number,field: keyof LostItem,value: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      ),
    }));
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addOfficer = () => {
    setFormData((prev) => ({
      ...prev,
      officers: [
        ...prev.officers,
        {
          name: "",
          designation: "",
        },
      ],
    }));
  };

  const updateOfficer = (index: number,field: keyof Officer,value: string) => {
    setFormData((prev) => ({
      ...prev,
      officers: prev.officers.map((officer, i) =>
        i === index
          ? { ...officer, [field]: value }
          : officer
      ),
    }));
  };

  const removeOfficer = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      officers: prev.officers.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleChange = (field: string, value: string | null) => {
    setFormData((prev) => ({
      ...prev,
      [field as keyof FR1043FormData]: value as string,
    }));
  };

  const downloadPdf = async () => {
    if (!displayedForm?.id) {
      return;
    }

    try {
      const blob = await downloadPdfMutation.mutateAsync(displayedForm.id);
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = `FR1043-${displayedForm.reference_number ?? displayedForm.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ?? "Unable to download the FR1043 PDF.",
      );
    }
  };

  const previewPdf = async () => {
    if (!displayedForm?.id) {
      toast.info("Save the FR104(3) form before previewing its PDF.");
      return;
    }

    try {
      const blob = await downloadPdfMutation.mutateAsync(displayedForm.id);
      setPreviewUrl(URL.createObjectURL(blob));
    } catch (error) {
      toast.error(
        (error as { response?: { data?: { message?: string } } }).response?.data?.message
          ?? "Unable to generate the FR1043 PDF preview.",
      );
    }
  };

useEffect(() => {
    if (!displayedForm || (!readOnly && (!Number.isInteger(accidentCaseId) || accidentCaseId <= 0))) {
      return;
    }
    // Older drafts may contain the retired top-level loss value. Do not send it
    // back when the user saves an updated draft.
    const { loss: _retiredLoss, ministry: legacyMinistry, ...currentData } = displayedForm.data as FR1043FormData & { loss?: unknown; ministry?: string };
    setFormData({ ...currentData, secretaryOfMinistry: currentData.secretaryOfMinistry ?? legacyMinistry ?? "" });
    setFormId(displayedForm.id);
    setFormStatus(displayedForm.status);
  }, [displayedForm]);

  //console.log("Form Id", formId);

  useEffect(() => {
    const status = (loadError as { response?: { status?: number } })?.response?.status;
    if (loadError && status !== 404) toast.error("Failed to load FR104(3) form.");
  }, [loadError]);

  if (!readOnly && loadingForm) return <Loader text="Loading FR104(3) form..." />;

  const saveDraft = async () => {
    if (!Number.isInteger(accidentCaseId) || accidentCaseId <= 0) {
      toast.error("Invalid accident case.");
      return null;
    }

    try {
      const response = await saveFR1043(formId, formStatus, formData);
      setFormId(response.id);
      setFormStatus(response.status);
      toast.success("FR104(3) draft saved successfully.");
      return response;
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || "Failed to save FR104(3) draft.");
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const savedForm = await saveDraft();

      if (!savedForm) {
        return;
      }

      try {
        const response = await submitMutation.mutateAsync(savedForm.id);
        setFormStatus(response.status);
        toast.success("FR104(3) form submitted successfully.");
      } catch (error: unknown) {
        const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
        toast.error(message || "Failed to submit FR104(3) form.");
      }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden mb-8">

          <div className="bg-blue-900 px-8 py-8 text-center">
            <h1 className="text-3xl font-bold text-white">
              {t("fr104_3.title")}
            </h1>

            <p className="text-blue-200 mt-2">
              {t("fr104_3.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 px-8 py-5 bg-slate-50 border-t">

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {t("fr104_3.referenceNo")}
              </p>

              <p className="font-semibold text-slate-800">
                {displayedForm?.reference_number ?? "Not saved"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Revision
              </p>

              <p className="font-semibold text-slate-800">
                {displayedForm ? `Revision ${displayedForm.revision}` : "Not saved"}
              </p>

              <p className="hidden">
                {readOnly ? `Revision ${displayedForm?.revision ?? "—"}` : new Date().toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {t("fr104_3.status")}
              </p>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {formStatus || t("fr104_3.draft")}
              </span>
            </div>

          </div>

          {readOnly && (
            <div className="grid gap-4 border-t border-slate-200 px-8 py-5 text-sm md:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Submitted Date</p> 
                <p className="font-semibold text-slate-800">{displayedForm?.submitted_at ? new Date(displayedForm.submitted_at).toLocaleString() : "—"}</p>
                </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Current Approval Step</p>
                <p className="font-semibold text-slate-800">{currentApproval ? `Step ${currentApproval.step} — ${currentApproval.status}` : "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">Approval Timeline Summary</p>
                <p className="font-semibold text-slate-800">{resolvedApprovalTimeline.length} step{resolvedApprovalTimeline.length === 1 ? "" : "s"} · {resolvedApprovalTimeline.filter((approval) => approval.status === "APPROVED").length} approved</p>
              </div>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">

          <form className="space-y-6 p-6 lg:p-8"
            id="fr1043-form"
            onSubmit={handleSubmit}
          >

            <fieldset disabled={!isEditable} className="space-y-6 disabled:opacity-70">
            {/* Part A - General Information (Form fields 1 & 2) */}
            <FormCard
              part="Part A"
              title={t("fr104_3.generalInformation")}
            >
              <GeneralInformationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part B - Nature of Loss (Form field 3) */}
            <FormCard
              part="Part B"
              title={t("fr104_3.natureOfLoss")}
            >
              <NatureOfLossSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part C - Lost Items (Form table) */}
            <FormCard
              part="Part C"
              title={t("fr104_3.itemsLost")}
            >
              <LostItemsSection
                formData={formData}
                addItem={addItem}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            </FormCard>

            {/* Part D - Cause of Loss (Form field 4) */}
            <FormCard
              part="Part D"
              title={t("fr104_3.causeOfLoss")}
            >
              <CauseOfLossSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part E - Officers Responsible (Form field 5) */}
            <FormCard
              part="Part E"
              title={t("fr104_3.officersResponsible")}
            >
              <OfficersSection
                formData={formData}
                addOfficer={addOfficer}
                updateOfficer={updateOfficer}
                removeOfficer={removeOfficer}
              />
            </FormCard>

            {/* Part F - Police Information (Form field 6) */}
            <FormCard
              part="Part F"
              title={t("fr104_3.policeStation")}
            >
              <PoliceInformationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part G - Investigation (Form field 7) */}
            <FormCard
              part="Part G"
              title={t("fr104_3.investigation")}
            >
              <InvestigationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part H - Security Arrangements (Form field 8) */}
            <FormCard
              part="Part H"
              title={t("fr104_3.securityArrangements")}
            >
              <SecurityArrangementSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part I - Prevention Arrangements (Form field 9) */}
            <FormCard
              part="Part I"
              title={t("fr104_3.preventionArrangements")}
            >
              <PreventionArrangementSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part J - Approval & Certification (Head of Dept / Secretary) */}
            {/* <FormCard
              part="Part J"
              title={t("fr104_3.approval")}
            >
              <ApprovalSection
                formData={formData}
                handleChange={handleChange}
                currentUser={currentUser}
              />
            </FormCard> */}
            </fieldset>

          </form>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <DocumentApprovalSignatures approvals={resolvedApprovalTimeline} />
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg p-4">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 ">
            {readOnly ? (
              <>
                <button type="button" onClick={downloadPdf} disabled={downloadPdfMutation.isPending} className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Download size={18} />{downloadPdfMutation.isPending ? "Generating PDF..." : "Download PDF"}
                </button>

                <button type="button" onClick={previewPdf} disabled={downloadPdfMutation.isPending} className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Eye size={18} />{downloadPdfMutation.isPending ? "Generating PDF..." : "Preview PDF"}
                </button>

                {onDecision && 
                  <button type="button" onClick={onDecision} className="w-full sm:w-auto px-5 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2">
                    <CheckCircle size={18} />Decision
                  </button>}
                  <button type="button" onClick={onBack} className="w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50">
                    Back
                  </button>
              </>
            ) : <>
            {displayedForm?.id && (
              <>
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={downloadPdfMutation.isPending}
                  className="order-2 sm:order-5 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  {downloadPdfMutation.isPending ? "Generating PDF..." : "Download PDF"}
                </button>

                <button
                  type="button"
                  onClick={previewPdf}
                  disabled={downloadPdfMutation.isPending}
                  className="order-2 sm:order-6 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <Eye size={18} />
                  {downloadPdfMutation.isPending ? "Generating PDF..." : "Preview PDF"}
                </button>
              </>
            )}

            {formStatus !== "APPROVED" && (
              <>
                <button
                  type="submit"
                  form="fr1043-form"
                  disabled={!isEditable || loadingForm || saving || submitting}
                  className="order-1 sm:order-4 w-full sm:w-auto px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2 font-medium">
                  <CheckCircle size={18} />
                  {submitting ? "Submitting..." : (formStatus === "CHANGES_REQUESTED" || (displayedForm?.revision ?? 1) > 1 ? "Submit Again" : t("fr104_3.submit"))}
                </button>

                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={!isEditable || loadingForm || saving || submitting}
                  className=" order-3 sm:order-2 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 "
                >
                  <Save size={18} />
                  {saving ? "Saving..." : t("fr104_3.saveDraft")}
                </button>
              </>
            )}

            {/* Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="order-4 sm:order-1 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 " >
              <Printer size={18} />
              {t("fr104_3.print")}
            </button>
            </>}
          </div>
        </div>
      </div>
      {!readOnly && isActionModalOpen && (
        <ActionModal
          step={"confirm" as unknown as approvalWorkflowStep}
          t={t}
          onClose={(action, comment) => {
            setIsActionModalOpen(false);

            console.log("Action:", action);
            console.log("Comment:", comment);

            // Handle approve/reject/submit here
          }}
        />
      )}
      {previewUrl && (
        <PdfPreviewModal
          filename={`FR1043-${displayedForm?.reference_number ?? displayedForm?.id ?? "preview"}.pdf`}
          pdfUrl={previewUrl}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  );
}

export default FR104_3Form
