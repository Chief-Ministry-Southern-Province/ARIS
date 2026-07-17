import { useState } from "react";
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
import { FormCard } from "@/components/molecules/FormCard";
import { useTranslation } from "react-i18next";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import {Printer,Save, CheckCircle} from "lucide-react";
import {initialFormData} from "./initialFormData";
import ActionModal from "@/components/organisms/Forms/ActionModel";
import type { approvalWorkflowStep } from "@/types/approvalWorkflow.type";

type FR1044Status =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_APPROVAL"
  | "CHANGES_REQUESTED"
  | "APPROVED";

interface FR104_4FormProps {
  referenceNumber?: string;
  revision?: number;
  status?: FR1044Status;
}

const STATUS_BADGE_CLASSES: Record<FR1044Status, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  SUBMITTED: "bg-blue-100 text-blue-700",
  UNDER_APPROVAL: "bg-yellow-100 text-yellow-800",
  CHANGES_REQUESTED: "bg-red-100 text-red-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
};

export default function FR104_4Form({
  referenceNumber,
  revision = 1,
  status = "DRAFT",
}: FR104_4FormProps) {

  const { t } = useTranslation();
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const [formData, setFormData] =
    useState<FR104_4FormData>(
      initialFormData
    );

  const handleChange = (
    field: string,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value as unknown as string,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log(formData);
  };

 return (
  <div className="min-h-screen bg-slate-100 py-8">
    <div className="max-w-7xl mx-auto px-6">

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 mb-8 overflow-hidden">

        <div className="bg-blue-900 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">
            {t("fr104_4.title")}
          </h1>

          <p className="text-blue-200 mt-2">
            {t("fr104_4.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-8 py-4">
          <div>
            <p className="text-xs text-slate-500">
              {t("fr104_4.generalInformation.referenceNo")}
            </p>
            <p className="font-semibold text-slate-800">
              {referenceNumber || formData.referenceNo || "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
              {t("fr104_4.meta.revisionLabel")}
            </p>
            <p className="font-semibold text-slate-800">
              {t("fr104_4.meta.revisionValue")} {revision}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">
              {t("fr104_4.meta.statusLabel")}
            </p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGE_CLASSES[status]}`}
            >
              {t(`fr104_4.meta.status.${status}`)}
            </span>
          </div>
        </div>

      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <FormCard
          part={t("fr104_4.parts.a")}
          title={t("fr104_4.sections.generalInformation")}
        >
          <GeneralInformationSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.b")}
          title={t("fr104_4.sections.lossDetails")}
        >
          <LossDetailsSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.c")}
          title={t("fr104_4.sections.causeOfLoss")}
        >
          <CauseOfLossSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.d")}
          title={t("fr104_4.sections.policeInformation")}
        >
          <PoliceInformationSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.e")}
          title={t("fr104_4.sections.lostItems")}
        >
          <LostItemsSection
            formData={formData}
            setFormData={setFormData}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.f")}
          title={t("fr104_4.sections.responsibleOfficers")}
        >
          <OfficersResponsibleSection
            formData={formData}
            setFormData={setFormData}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.g")}
          title={t("fr104_4.sections.legalAction")}
        >
          <LegalActionSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.h")}
          title={t("fr104_4.sections.investigation")}
        >
          <InvestigationSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.i")}
          title={t("fr104_4.sections.recoveryInformation")}
        >
          <RecoveryInformationSection
            formData={formData}
            setFormData={setFormData}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.j")}
          title={t("fr104_4.sections.insuranceInformation")}
        >
          <InsuranceInformationSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.k")}
          title={t("fr104_4.sections.boardOfInquiry")}
        >
          <BoardOfInquirySection
            formData={formData}
            setFormData={setFormData}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.l")}
          title={t("fr104_4.sections.recommendations")}
        >
          <RecommendationsSection
            handleChange={handleChange}
          />
        </FormCard>

        <FormCard
          part={t("fr104_4.parts.m")}
          title={t("fr104_4.preventiveActions.title")}
        >
          <PreventiveActionsSection
            formData={formData}
            handleChange={handleChange}
          />
        </FormCard>

        {/* <FormCard
          part={t("fr104_4.parts.n")}
          title={t("fr104_4.sections.approval")}
        >
          <ApprovalSection
             formData={formData}
             handleChange={handleChange} 
             currentUser={currentUser}  
          />
        </FormCard> */}

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-whiteborder-t border-slate-200 shadow-lg p-4">
          <div className="flex flex-col sm:flex-row sm:justify-end gap-3 ">
            {/* Submit */}
            <button
              type="submit"
              className="order-1 sm:order-4 w-full sm:w-auto px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 flex items-center justify-center gap-2 font-medium">
              <CheckCircle size={18} />
              Submit
            </button>

            {/* Approve */}
            {/* <button
              type="button"
              onClick={() => setIsActionModalOpen(true)}
              className="  order-2 sm:order-3 w-full sm:w-auto px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2 ">
              <CheckCircle size={18} />
              Approve
            </button> */}

            {/* Save Draft */}
            <button
              type="button"
              className=" order-3 sm:order-2 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 "
            >
              <Save size={18} />
              Save Draft
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={() => window.print()}
              className="order-4 sm:order-1 w-full sm:w-auto px-5 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 " >
              <Printer size={18} />
              Print
            </button>
          </div>
        </div>
      </form>
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