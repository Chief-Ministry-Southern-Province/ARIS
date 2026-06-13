import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import { DriverCombobox } from "@/components/organisms/AdminPanel/DriverCombobox";
import { useTranslation } from "react-i18next";

export default function AddVehicleForm() {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold mb-6">
        {t("adminPanel.vehicles.registerVehicle")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label={t("adminPanel.vehicles.registrationNumber")}
          required
        >
          <InputField placeholder="WP-CAB-1234" />
        </FormField>

        <FormField
          label={t("adminPanel.vehicles.type")}
          required
        >
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Car</option>
            <option>Van</option>
            <option>Motorcycle</option>
            <option>Bus</option>
            <option>Truck</option>
          </select>
        </FormField>

        <FormField label="Make" required>
          <InputField placeholder="Toyota" />
        </FormField>

        <FormField label="Model" required>
          <InputField placeholder="Corolla" />
        </FormField>

        <FormField label="Year" required>
          <InputField
            type="number"
            placeholder="2023"
          />
        </FormField>

        <FormField
          label={t("adminPanel.users.institution")}
          required
        >
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>National Hospital Colombo</option>
            <option>Teaching Hospital Kandy</option>
            <option>Regional Health Office Galle</option>
          </select>
        </FormField>

        <FormField label="Engine Number">
          <InputField placeholder="ENG123456" />
        </FormField>

        <FormField label="Chassis Number">
          <InputField placeholder="CHS123456" />
        </FormField>

        <FormField label="Insurance Number">
          <InputField placeholder="INS123456" />
        </FormField>

        <FormField label="Insurance Expiry">
          <InputField type="date" />
        </FormField>

       <div className="md:col-span-2 pt-2">
           <h2 className="text-lg font-semibold mb-6">
            Assign Driver
          </h2>
          <FormField label="Assigned Driver">
            <DriverCombobox />
          </FormField>
       </div>

      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="px-5 py-2 border border-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Register Vehicle
        </button>
      </div>
    </div>
  );
}