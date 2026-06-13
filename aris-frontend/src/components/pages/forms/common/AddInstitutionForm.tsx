import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";

const AddInstitutionForm = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {t("adminPanel.institutions.addInstitution")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Institution Name" required>
          <InputField placeholder="National Hospital Colombo" />
        </FormField>

        <FormField label="Institution Code" required>
          <InputField placeholder="NHC001" />
        </FormField>

        <FormField label="Institution Type" required>
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Type</option>
            <option>National Hospital</option>
            <option>Teaching Hospital</option>
            <option>Base Hospital</option>
            <option>District Hospital</option>
            <option>Regional Health Office</option>
            <option>Provincial Health Office</option>
            <option>Ministry</option>
          </select>
        </FormField>

        <FormField label="Province" required>
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Province</option>
            <option>Western</option>
            <option>Central</option>
            <option>Southern</option>
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
          <InputField placeholder="Colombo" />
        </FormField>

        <FormField
          label={t("adminPanel.institutions.director")}
          required
        >
          <InputField placeholder="Dr. Nimal Perera" />
        </FormField>

        <FormField label="Email">
          <InputField
            type="email"
            placeholder="institution@gov.lk"
          />
        </FormField>

        <FormField label="Contact Number">
          <InputField placeholder="0112345678" />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Address">
            <textarea
              rows={3}
              placeholder="Institution Address"
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        >
          {t("adminPanel.institutions.addInstitution")}
        </button>
      </div>
    </div>
  );
};

export default AddInstitutionForm;