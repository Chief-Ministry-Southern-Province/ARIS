/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import { useUpdateInstitutionMutation } from "@/hooks/mutations/useResourceMutations";
import { useInstitution, useInstitutionTypes, useParentInstitutions } from "@/hooks/queries/useInstitutionQueries";
import type { updateInstitutionRequest } from "@/types/Institution.type";
import { useEffect, useState } from "react";
import {formatInstitutionType} from "@/utils/formatInstitution";
import { toast } from "react-toastify";
import Loader from "@/components/atoms/Loader";

const EditInstitutionForm = ({ onSuccess, institutionId,setShowEditInstitution }: { onSuccess: () => void; institutionId: string, setShowEditInstitution: React.Dispatch<React.SetStateAction<boolean>> }) => {
  
  const { t } = useTranslation();
  const { mutateAsync: updateInstitutionData } = useUpdateInstitutionMutation();
  const { data: institutionTypes = [], isLoading: loading } = useInstitutionTypes();
  const { data: parentInstitutions = [], isLoading: parentInstitutionsLoading } = useParentInstitutions();
  const { data: institution, isLoading: institutionLoading } = useInstitution(Number(institutionId));

  const [institutionData, setInstitutionData] = useState<updateInstitutionRequest>({
    name: "",
    type: "DIVISIONAL_HOSPITAL",
    province: "",
    district: "",
    head_of_institution: "",
    parent_institution_id: null,
    contact_number: "",
    address: ""
  });
  useEffect(() => {
    if (institution) {
      setInstitutionData({
        name: institution.name ?? "",
        type: institution.type ?? "DIVISIONAL_HOSPITAL",
        province: institution.province ?? "Southern",
        district: institution.district ?? "",
        head_of_institution: institution.head_of_institution ?? "",
        parent_institution_id: institution.parent_institution_id ?? null,
        contact_number: institution.contact_number ?? "",
        address: institution.address ?? "",
      });
    }
  }, [institution]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditInstitution = async (institutionData: updateInstitutionRequest) => {
    try {
      setIsSubmitting(true);

      //console.log("Updating institution with data:", institutionData);
      const response = await updateInstitutionData({ id: Number(institutionId), data: institutionData });

      console.log("Institution updated:", response);

      toast.success("Institution updated successfully.");
      onSuccess();
    } catch (error) {
      const validationErrors = (error as { response?: { data?: { errors?: unknown } } })?.response?.data?.errors;
      toast.error("Validation errors occurred.");
      console.log("Validation errors:", validationErrors);
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <>
      {institutionLoading ? (
        <Loader  text='Loading...' />
      ) : (
        <div className="bg-white">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {t("adminPanel.institutions.editInstitution")}
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
                onChange={(e) => setInstitutionData({ ...institutionData, type: e.target.value as updateInstitutionRequest["type"] })}
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
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setShowEditInstitution(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => handleEditInstitution(institutionData)}
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
                ? "Editing..."
                :"Edit Institution"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EditInstitutionForm;
