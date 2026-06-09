import { useState } from "react";

import GeneralInformationSection from "@/components/organisms/FR104_4/GeneralInformationSection";
import LossDetailsSection from "@/components/organisms/FR104_4/LossDetailsSection";
import CauseOfLossSection from "@/components/organisms/FR104_4/CauseOfLossSection";
import LostItemsSection from "@/components/organisms/FR104_4/LostItemSection";
import OfficersResponsibleSection from "@/components/organisms/FR104_4/OfficersResponsibleSection";
import PoliceInformationSection from "@/components/organisms/FR104_4/PoliceInformationSection";
import InvestigationSection from "@/components/organisms/FR104_4/InvestigationSection";
import RecoveryInformationSection from "@/components/organisms/FR104_4/RecoveryInformationSection";
import InsuranceInformationSection from "@/components/organisms/FR104_4/InsuranceInformationSection";
import BoardOfInquirySection from "@/components/organisms/FR104_4/BoardOfInquirySection";
import RecommendationsSection from "@/components/organisms/FR104_4/RecommendationsSection";
import ApprovalSection from "@/components/organisms/FR104_4/ApprovalSection";
import LegalActionSection from "@/components/organisms/FR104_4/LegalActionSection";
import PreventiveActionsSection from "@/components/organisms/FR104_4/PreventiveActionsSection";
import { FormCard } from "@/components/molecules/FormCard";
import { useTranslation } from "react-i18next";
import type { FR104_4FormData } from "@/types/FR104_4_types";


import {initialFormData} from "./initialFormData";

export default function FR104_4Form() {

  const { t } = useTranslation();

  const [formData, setFormData] =
    useState<FR104_4FormData>(
      initialFormData
    );

  const handleChange = (
    field: keyof FR104_4FormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
          />
        </FormCard>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-white border border-slate-200 rounded-2xl shadow-md px-6 py-4 flex justify-end gap-4">

          <button
            type="button"
            onClick={() => window.print()}
            className="px-5 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Print
          </button>

          <button
            type="button"
            className="px-5 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50"
          >
            Save Draft
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
          >
            Submit
          </button>

        </div>
      </form>
    </div>
  </div>
);
}