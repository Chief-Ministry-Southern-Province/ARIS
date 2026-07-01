import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import { useCreateInstitution,useGetAllowedInstitutionTypes, useGetParentInstitutions } from "@/hooks/useInstitution";
import type { createInstitutionRequest } from "@/types/Institution.type";
import { useEffect, useState } from "react";
import {formatInstitutionType} from "@/utils/formatInstitution";
import { toast } from "react-toastify";

const AddInstitutionForm = ({ onSuccess }: { onSuccess: () => void }) => {
  
  const { t } = useTranslation();
  const { createNewInstitution } = useCreateInstitution();
  const { institutionTypes,fetchAllowedInstitutionTypes, loading } = useGetAllowedInstitutionTypes();
  const { parentInstitutions, fetchParentInstitutions, loading: parentInstitutionsLoading } = useGetParentInstitutions();
  
  useEffect(() => {
    fetchAllowedInstitutionTypes();
    fetchParentInstitutions();
  }, []);
  // console.log(institutionTypes)
  // console.log(parentInstitutions)

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateInstitution = async (institutionData: createInstitutionRequest) => {
    try {
      setIsSubmitting(true);

      console.log("Creating institution with data:", institutionData);
      const response = await createNewInstitution(institutionData);

      console.log("Institution created:", response);

      setInstitutionData({
        name: "",
        type: "DIVISIONAL_HOSPITAL",
        province: "Southern",
        district: "",
        head_of_institution: "",
        parent_institution_id: null,
        contact_number: "",
        address: ""
      });

      onSuccess();
      toast.success("Institution created successfully.");
    } catch (error) {
      const validationErrors = (error as { response?: { data?: { errors?: unknown } } })?.response?.data?.errors;
      toast.error("Validation errors occurred.");
      console.log("Validation errors:", validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  const [institutionData, setInstitutionData] = useState<createInstitutionRequest>({
    name: "",
    type: "DIVISIONAL_HOSPITAL",
    province: "Southern",
    district: "",
    head_of_institution: "",
    parent_institution_id: null,
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
            placeholder="National Hospital Galle" 
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

        <FormField label="Parent Institution" required>
          <select
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={institutionData.parent_institution_id?.toString() ?? ""}
            onChange={(e) =>
              setInstitutionData({
                ...institutionData,
                parent_institution_id:
                  e.target.value === "" ? null : Number(e.target.value),
              })
            }
          >
            <option value="">Select Parent Institution</option>

            {parentInstitutionsLoading ? (
              <option disabled>Loading...</option>
            ) : (
              parentInstitutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.name}
                </option>
              ))
            )}
          </select>
        </FormField>

        <FormField label="Province" required>
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={institutionData.province ?? "Southern"}
            onChange={(e) => setInstitutionData({ ...institutionData, province: e.target.value })}
          >
            <option selected value={'Southern'} >Southern</option>
            <option value={'Western'}>Western</option>
            <option value={'Central'}>Central</option>
            <option value={'Northern'}>Northern</option>
            <option value={'Eastern'}>Eastern</option>
            <option value={'North Western'}>North Western</option>
            <option value={'North Central'}>North Central</option>
            <option value={'Uva'}>Uva</option>
            <option value={'Sabaragamuwa'}>Sabaragamuwa</option>
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
            <option selected value={'Galle'}>Galle</option>
            <option value={'Matara'}>Matara</option>
            <option value={'Hambantota'}>Hambantota</option>
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
          disabled={isSubmitting}
          className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={() => handleCreateInstitution(institutionData)}
        >
          {isSubmitting && (
            <svg
              className="w-4 h-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          )}

          {isSubmitting
            ? "Creating..."
            : t("adminPanel.institutions.addInstitution")}
        </button>
      </div>
    </div>
  );
};

export default AddInstitutionForm;