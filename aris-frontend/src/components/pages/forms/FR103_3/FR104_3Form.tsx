import {useState} from "react";
import type {FR104_3Data , LostItem , Officer } from "@/types/form_104_3_types";
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
const FR104_3Form = () => {

  const currentUser: User = users[0];

  const { t } = useTranslation();


  const [formData, setFormData] = useState<FR104_3Data>({
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

    // Approval Workflow
    preparedBy: "",
    preparedDesignation: "",
    preparedByUserId: "",
    preparedSignature: null,
    preparedDate: "",

    headName: "",
    headDesignation: "",
    headUserId: "",
    headSignature: null,
    headApprovalDate: "",

    secretaryName: "",
    secretaryDesignation: "",
    secretaryUserId: "",
    secretarySignature: null,
    secretaryApprovalDate: "",

    items: [],
    officers:[]
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
  const updateItem = (
    index: number,
    field: keyof LostItem,
    value: string
  ) => {
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

  const updateOfficer = (
    index: number,
    field: keyof Officer,
    value: string
  ) => {
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
      [field as keyof FR104_3Data]: value as string,
    }));
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
                FR104-3-{new Date().getFullYear()}-0001
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
                Status
              </p>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Draft
              </span>
            </div>

          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200">

          <form className="space-y-6 p-6 lg:p-8">

            {/* Part A */}
            <FormCard
              part="Part A"
              title="General Information"
            >
              <GeneralInformationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part B */}
            <FormCard
              part="Part B"
              title="Details of Loss"
            >
              <NatureOfLossSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part C */}
            <FormCard
              part="Part C"
              title="Cause of Loss"
            >
              <CauseOfLossSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part D */}
            <FormCard
              part="Part D"
              title="Lost Items"
            >
              <LostItemsSection
                formData={formData}
                addItem={addItem}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            </FormCard>

            {/* Part E */}
            <FormCard
              part="Part E"
              title="Police Information"
            >
              <PoliceInformationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part F */}
            <FormCard
              part="Part F"
              title="Responsible Officers"
            >
              <OfficersSection
                formData={formData}
                addOfficer={addOfficer}
                updateOfficer={updateOfficer}
                removeOfficer={removeOfficer}
              />
            </FormCard>

            {/* Part G */}
            <FormCard
              part="Part G"
              title="Investigation Findings"
            >
              <InvestigationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part H */}
            <FormCard
              part="Part H"
              title="Security Arrangements"
            >
              <SecurityArrangementSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part I */}
            <FormCard
              part="Part I"
              title="Preventive Measures"
            >
              <PreventionArrangementSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* Part J */}
            <FormCard
              part="Part J"
              title="Approval & Certification"
            >
              <ApprovalSection
                formData={formData}
                handleChange={handleChange}
                currentUser={currentUser}
              />
            </FormCard>

          </form>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-0 bg-white border border-slate-200 rounded-2xl shadow-md px-6 py-4 flex justify-end gap-4">

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

      </div>
    </div>
  );
}

export default FR104_3Form