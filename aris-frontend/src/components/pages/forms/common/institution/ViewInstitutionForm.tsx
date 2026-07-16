/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useInstitution, useParentInstitutions } from "@/hooks/queries/useInstitutionQueries";
import Loader from "@/components/atoms/Loader";
import type { Institution } from "@/types/Institution.type";
import { formatInstitutionType } from "@/utils/formatInstitution";

const ViewInstitutionForm = ({ institutionId,setShowViewInstitution }: { institutionId: string, setShowViewInstitution: (show: boolean) => void }) => {
  
  const { t } = useTranslation();
  const { data: institution, isLoading: institutionLoading } = useInstitution(Number(institutionId));
  const { data: parentInstitutions = [], isLoading: parentInstitutionsLoading } = useParentInstitutions();

  const [institutionData, setInstitutionData] = useState<Partial<Institution>>({});
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
              />
            </FormField>

            <FormField label="Institution Type" required>
              <InputField 
                placeholder="DIVISIONAL_HOSPITAL" 
                value={formatInstitutionType(institutionData.type ?? "DIVISIONAL_HOSPITAL")}
              />
            </FormField>

            <FormField label="Parent Institution" required>
             <InputField 
                placeholder="National Hospital Galle" 
                value={parentInstitutionsLoading ? "Loading..." : parentInstitutions.find(inst => inst.id === institutionData.parent_institution_id)?.name ?? "N/A"}
              />
            </FormField>

            <FormField label="Province" required>
              <InputField 
                placeholder="National Hospital Galle" 
                value={institutionData.province ?? ""}
              />
            </FormField>

            <FormField
              label={t("adminPanel.institutions.district")}
              required
            >
              <InputField 
                placeholder="National Hospital Galle" 
                value={institutionData.district ?? ""}
              />
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
              onClick={() => setShowViewInstitution(false)}
            >
              Cancel
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default ViewInstitutionForm;
