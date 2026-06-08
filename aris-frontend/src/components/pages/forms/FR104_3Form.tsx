import {useState} from "react";
import type {FR104_3Data , LostItem , Officer } from "@/types/form_104_3_types";
import GeneralInformationSection from "@/components/organisms/FR104_3/GeneralInformationSection";
import PoliceInformationSection from "@/components/organisms/FR104_3/PoliceInformationSection";
import ApprovalSection from "@/components/organisms/FR104_3/ApprovalSection";
import NatureOfLossSection from "@/components/organisms/FR104_3/NatureOfLossSection";
import LostItemsSection from "@/components/organisms/FR104_3/LostItemsSection";
import CauseOfLossSection from "@/components/organisms/FR104_3/CauseOfLossSection";
import OfficersSection from "@/components/organisms/FR104_3/OfficersSection";
import InvestigationSection from "@/components/organisms/FR104_3/InvestigationSection";
import SecurityArrangementSection from "@/components/organisms/FR104_3/SecurityArrangementSection";
import PreventionArrangementSection from "@/components/organisms/FR104_3/PreventionArrangementSection";
import { useTranslation } from "react-i18next";
import {FormCard} from "@/components/molecules/FormCard";
import { CheckCircle, Save, Printer } from "lucide-react";

const FR104_3Form = () => {

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
    headOfDepartment: "",
    approvalDate: "",
    items: [],
    officers: [],
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

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200 mb-8">
          <div className="bg-blue-900 px-8 py-6 text-center">
            <h1 className="text-3xl font-bold text-white">
              {t("fr104_3.title")}
            </h1>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              {/* <p className="text-sm text-slate-500">
                Government of Sri Lanka
              </p> */}
              <p className="font-semibold text-slate-700">
                FR 104(3) — Statement of Loss / Damage
              </p>
            </div>

            <div className="flex gap-8 text-sm">
              <div>
                <p className="text-slate-500">{t("fr104_3.referenceNo")}</p>
                <p className="font-medium">ARIS-2024-001</p>
              </div>

              <div>
                <p className="text-slate-500">{t("fr104_3.date")}</p>
                <p className="font-medium">2024-03-15</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">

          <form className="space-y-8 p-8">

            <FormCard title="Part A — General Information">
              <GeneralInformationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part B — Details of Loss">
              <NatureOfLossSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part C — Lost Items">
              <LostItemsSection
                formData={formData}
                addItem={addItem}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            </FormCard>

            <FormCard title="Part D — Cause of Loss">
              <CauseOfLossSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part E — Police Information">
              <PoliceInformationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part F — Responsible Officers">
              <OfficersSection
                formData={formData}
                addOfficer={addOfficer}
                updateOfficer={updateOfficer}
                removeOfficer={removeOfficer}
              />
            </FormCard>

            <FormCard title="Part G — Investigation Findings">
              <InvestigationSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part H — Security Arrangements">
              <SecurityArrangementSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part I — Preventive Measures">
              <PreventionArrangementSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            <FormCard title="Part J — Approval & Certification">
              <ApprovalSection
                formData={formData}
                handleChange={handleChange}
              />
            </FormCard>

            {/* {Action BUtton} */}
             <div className="flex gap-3 no-print justify-end mt-4">

              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-3 bg-white text-slate-700 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center gap-2"
              >
                <Printer size={18} />
                {t("btn.print")}
              </button>

              <button
                type="button"
                className="px-5 py-3 bg-white text-slate-700 rounded-xl border border-slate-300 hover:bg-slate-50 flex items-center gap-2"
              >
                <Save size={18} />
                {t("btn.saveDraft")}
              </button>

              <button
                type="submit"
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle size={18} />
                {t("fr104_3.submit")}
              </button>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}

export default FR104_3Form