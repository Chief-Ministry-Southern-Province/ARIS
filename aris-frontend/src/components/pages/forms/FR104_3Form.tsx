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
    <div className="max-w-6xl mx-auto p-6">
      {/* Form Header */}
      <div className="mb-8 text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("fr104_3.title")}
        </h1>

        <p className="mt-2 text-gray-600">
          {t("fr104_3.subtitle")}
        </p>
      </div>

      <form className="space-y-8">
        <GeneralInformationSection
          formData={formData}
          handleChange={handleChange}
        />

        <NatureOfLossSection
          formData={formData}
          handleChange={handleChange}
        />

        <LostItemsSection
          formData={formData}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
        />

        <CauseOfLossSection
          formData={formData}
          handleChange={handleChange}
        />

        <OfficersSection
          formData={formData}
          addOfficer={addOfficer}
          updateOfficer={updateOfficer}
          removeOfficer={removeOfficer}
        />

        <PoliceInformationSection
          formData={formData}
          handleChange={handleChange}
        />

        <InvestigationSection
          formData={formData}
          handleChange={handleChange}
        />

        <SecurityArrangementSection
          formData={formData}
          handleChange={handleChange}
        />

        <PreventionArrangementSection
          formData={formData}
          handleChange={handleChange}
        />

        <ApprovalSection
          formData={formData}
          handleChange={handleChange}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t("fr104_3.submit")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FR104_3Form