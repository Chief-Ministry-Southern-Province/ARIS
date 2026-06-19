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
import ApprovalSection from "@/components/organisms/Forms/ApprovalSection";
import LegalActionSection from "@/components/organisms/Forms/FR104_4/LegalActionSection";
import PreventiveActionsSection from "@/components/organisms/Forms/FR104_4/PreventiveActionsSection";
import { FormCard } from "@/components/molecules/FormCard";
import { useTranslation } from "react-i18next";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import {Printer,Save, CheckCircle} from "lucide-react";
import {initialFormData} from "./initialFormData";
import { users } from "@/components/data/mockData";
import type { User } from "@/components/data/mockData";
import ActionModal from "@/components/organisms/Forms/ActionModel";
import type { approvalWorkflowStep } from "@/types/approvalWorkflow.type";

export default function FR104_4Form() {

  const currentUser: User = users[0]; 
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

        <FormCard
          part={t("fr104_4.parts.n")}
          title={t("fr104_4.sections.approval")}
        >
          <ApprovalSection
             formData={formData}
             handleChange={handleChange} 
             currentUser={currentUser}  
          />
        </FormCard>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border border-slate-200 rounded-2xl shadow-md px-6 py-4 flex justify-end gap-4">

          <button
            type="button"
            onClick={() => setIsActionModalOpen(true)}
            className="
              px-6 py-2.5
              bg-blue-800
              text-white
              rounded-lg
              hover:bg-blue-900
              flex items-center gap-2
            "
          >
            <CheckCircle size={18} />
            Approve
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="
              px-5 py-2.5
              border border-slate-300
              rounded-lg
              hover:bg-slate-50
              flex items-center gap-2
              text-slate-700
            "
          >
            <Printer size={18} />
            Print
          </button>

          <button
            type="button"
            className="
              px-5 py-2.5
              border border-slate-300
              rounded-lg
              hover:bg-slate-50
              flex items-center gap-2
              text-slate-700
            "
          >
            <Save size={18} />
            Save Draft
          </button>

          <button
            type="submit"
            className="
              px-6 py-2.5
              bg-blue-800
              text-white
              rounded-lg
              hover:bg-blue-900
              flex items-center gap-2
            "
          >
            <CheckCircle size={18} />
            Submit
          </button>

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