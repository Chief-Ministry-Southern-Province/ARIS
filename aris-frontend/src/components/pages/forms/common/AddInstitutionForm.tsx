import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import { useCreateInstitution,useGetAllowedInstitutionTypes } from "@/hooks/useInstitution";
import type { createInstitutionRequest } from "@/types/Institution.type";
import { useEffect, useState } from "react";
import {formatInstitutionType} from "@/utils/formatInstitution";

const AddInstitutionForm = () => {
  
  const { t } = useTranslation();
  const { createNewInstitution } = useCreateInstitution();
  const { institutionTypes,fetchAllowedInstitutionTypes, loading } = useGetAllowedInstitutionTypes();

  useEffect(() => {
    fetchAllowedInstitutionTypes();
  }, []);
  console.log(institutionTypes)

  const handleCreateInstitution = async (institutionData: createInstitutionRequest) => {
    try {
      const response = await createNewInstitution(institutionData);
      console.log("Institution created:", response);
    } catch (error) {
      console.error("Error creating institution:", error);
    }
  };

  const [institutionData, setInstitutionData] = useState<createInstitutionRequest>({
    name: "",
    type: "DIVISIONAL_HOSPITAL",
    province: "",
    district: "",
    head_of_institution: "",
    contact_number: "",
    address: ""
  });

  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {t("adminPanel.institutions.addInstitution")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Institution Name" required>
          <InputField 
            placeholder="National Hospital Colombo" 
            value={institutionData.name}
            onChange={(e) => setInstitutionData({...institutionData, name: e.target.value})}
          />
        </FormField>

        <FormField label="Institution Type" required>
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={institutionData.type}
            onChange={(e) => setInstitutionData({ ...institutionData, type: e.target.value as createInstitutionRequest["type"] })}
          >
            {loading ? <option>Loading...</option> : institutionTypes.map((type: string) => (
              <option key={type} value={type}>
                {formatInstitutionType(type)}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Province" required>
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={institutionData.province ?? ""}
            onChange={(e) => setInstitutionData({ ...institutionData, province: e.target.value })}
          >
            <option value="">Select Province</option>
            <option>Western</option>
            <option>Central</option>
            <option selected>Southern</option>
            <option>Northern</option>
            <option>Eastern</option>
            <option>North Western</option>
            <option>North Central</option>
            <option>Uva</option>
            <option>Sabaragamuwa</option>
          </select>
        </FormField>

        <FormField
          label={t("adminPanel.institutions.district")}
          required
        >
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={institutionData.district ?? ""}
            onChange={(e) => setInstitutionData({ ...institutionData, district: e.target.value })}
          >
            <option value="">Select District</option>
            <option selected>Galle</option>
            <option>Matara</option>
            <option>Hambantota</option>
          </select>
        </FormField>

        <FormField
          label={t("adminPanel.institutions.headOfInstitution")}
        >
          <InputField 
            placeholder="Dr. Nimal Perera" 
            value={institutionData.head_of_institution ?? ""}
            onChange={(e) => setInstitutionData({...institutionData, head_of_institution: e.target.value})}
          />
        </FormField>


        <FormField label="Contact Number">
          <InputField placeholder="0112345678" 
            value={institutionData.contact_number ?? ""}
            onChange={(e) => setInstitutionData({...institutionData, contact_number: e.target.value})}
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Address">
            <textarea
              rows={3}
              placeholder="Institution Address"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={institutionData.address ?? ""}
              onChange={(e) => setInstitutionData({...institutionData, address: e.target.value})}
            />
          </FormField>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <button
          type="button"
          className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
          onClick={() => handleCreateInstitution(institutionData)}
        >
          {t("adminPanel.institutions.addInstitution")}
        </button>
      </div>
    </div>
  );
};

export default AddInstitutionForm;