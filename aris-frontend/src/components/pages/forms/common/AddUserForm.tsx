import { InputField } from "@/components/atoms/InputField";
import { FormField } from "@/components/molecules/FormField";
import { useTranslation } from "react-i18next";

export default function AddUserForm() {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold mb-6">
        {t("adminPanel.users.addUser")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label={t("adminPanel.users.user")}
          required
        >
          <InputField placeholder="John Doe" />
        </FormField>

        <FormField
          label={t("adminPanel.users.username")}
          required
        >
          <InputField placeholder="john.doe" />
        </FormField>

        <FormField
          label="Email"
          required
        >
          <InputField
            type="email"
            placeholder="john@email.com"
          />
        </FormField>

        <FormField
          label="NIC"
          required
        >
          <InputField placeholder="199912345678" />
        </FormField>

        <FormField
          label={t("adminPanel.users.role")}
          required
        >
          <select className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Driver</option>
            <option>Development Officer</option>
            <option>Administrative Officer</option>
            <option>Investigation Officer</option>
            <option>Medical Superintendent</option>
            <option>Regional Director</option>
            <option>Provincial Director</option>
            <option>Admin</option>
          </select>
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

        <FormField
          label="Contact Number"
        >
          <InputField placeholder="0712345678" />
        </FormField>

        <FormField label="Password" required>
          <InputField
            type="password"
            placeholder="********"
          />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button className="px-5 py-2 border border-gray-300 rounded-lg">
          Cancel
        </button>

        <button className="px-5 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
          Create User
        </button>
      </div>
    </div>
  );
}