import {useEffect, useState} from "react";
import type { FR1043FormData , LostItem , Officer } from "@/types/form_104_3_types";
import GeneralInformationSection from "@/components/organisms/Forms/FR104_3/GeneralInformationSection";
import PoliceInformationSection from "@/components/organisms/Forms/FR104_3/PoliceInformationSection";
import ApprovalSection from "@/components/organisms/Forms/ApprovalSection";
import NatureOfLossSection from "@/components/organisms/Forms/FR104_3/NatureOfLossSection";
import LostItemsSection from "@/components/organisms/Forms/FR104_3/LostItemsSection";
import CauseOfLossSection from "@/components/organisms/Forms/FR104_3/CauseOfLossSection";
import OfficersSection from "@/components/organisms/Forms/FR104_3/OfficersSection";
import InvestigationSection from "@/components/organisms/Forms/FR104_3/InvestigationSection";
import SecurityArrangementSection from "@/components/organisms/Forms/FR104_3/SecurityArrangementSection";
import PreventionArrangementSection from "@/components/organisms/Forms/FR104_3/PreventionArrangementSection";
import { useTranslation } from "react-i18next";
import {FormCard} from "@/components/molecules/FormCard";
import { CheckCircle, Save, Printer } from "lucide-react";
import { users } from "@/components/data/mockData";
import type { User } from "@/components/data/mockData";
import type { approvalWorkflowStep } from "@/types/approvalWorkflow.type";
import ActionModal from "@/components/organisms/Forms/ActionModel";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetFR1043, useSaveFR1043, useSubmitFR1043 } from "@/hooks/useFR1043";
import type { FR1043Status } from "@/types/form_104_3_types";

const FR104_3Form = () => {

  const currentUser: User = users[0];

  const { caseId } = useParams();
  const accidentCaseId = Number(caseId);

  const { t } = useTranslation();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [formId, setFormId] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<FR1043Status | null>(null);

  const { data: loadedForm, isLoading: loadingForm, error: loadError } = useGetFR1043(accidentCaseId);
  const { saveFR1043, loading: saving } = useSaveFR1043(accidentCaseId);
  const submitMutation = useSubmitFR1043(accidentCaseId);
  const submitting = submitMutation.isPending;
  const isEditable = !formStatus || ["DRAFT", "CHANGES_REQUESTED"].includes(formStatus);

  const [formData, setFormData] = useState<FR1043FormData>({
    department: "",
    date: "",
    place: "",
    loss: "",

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

  useEffect(() => {
    if (!Number.isInteger(accidentCaseId) || accidentCaseId <= 0) {
      return;
    }

    if (loadedForm) {
      setFormData(loadedForm.data);
      setFormId(loadedForm.id);
      setFormStatus(loadedForm.status);
    }
  }, [loadedForm]);

  useEffect(() => {
    const status = (loadError as { response?: { status?: number } })?.response?.status;
    if (loadError && status !== 404) toast.error("Failed to load FR104(3) form.");
  }, [loadError]);

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
                {loadedForm?.reference_number ?? "Not saved"}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                {t("fr104_3.date")}
              </p>

              <p className="font-semibold text-slate-800">
                {new Date().toLocaleDateString()}
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
              title={t("fr104_3.partA")}
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
            <FormCard
              part="Part J"
              title={t("fr104_3.approval")}
            >
              <ApprovalSection
                formData={formData}
                handleChange={handleChange}
                currentUser={currentUser}
              />
            </FormCard>
            </fieldset>

          </form>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 shadow-lg p-4">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 ">
            {/* Submit */}
            <button
              type="submit"
              form="fr1043-form"
              disabled={!isEditable || loadingForm || saving || submitting}
              className="order-1 sm:order-4 w-full sm:w-auto px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2 font-medium">
              <CheckCircle size={18} />
              {submitting ? "Submitting..." : t("fr104_3.submit")}
            </button>

            {/* Approve */}
            <button
              type="button"
              onClick={() => setIsActionModalOpen(true)}
              className="order-2 sm:order-3 w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 ">
              <CheckCircle size={18} />
              {t("fr104_3.approve")}
            </button>

            {/* Save Draft */}
            <button
              type="button"
              onClick={saveDraft}
              disabled={!isEditable || loadingForm || saving || submitting}
              className=" order-3 sm:order-2 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 "
            >
              <Save size={18} />
              {saving ? "Saving..." : t("fr104_3.saveDraft")}
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="order-4 sm:order-1 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 " >
              <Printer size={18} />
              {t("fr104_3.print")}
            </button>
          </div>
        </div>
      </div>
      {isActionModalOpen && (
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
    </div>
  );
}

export default FR104_3Form
