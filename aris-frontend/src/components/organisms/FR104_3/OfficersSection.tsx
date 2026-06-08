import { InputField } from "@/components/atoms/InputField";
import type { FR104_3Data , Officer } from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";

interface OfficersSectionProps {
  formData: FR104_3Data;
  addOfficer: () => void;
  updateOfficer: (
    index: number,
    field: keyof Officer,
    value: string
  ) => void;
  removeOfficer: (index: number) => void;
}

const OfficersSection = ({
  formData: { officers },
  addOfficer,
  updateOfficer,
  removeOfficer,
}: OfficersSectionProps) => {

  const { t } = useTranslation();

  return (
    <div>
      <h2 className="font-semibold text-lg mb-3">
        {t("fr104_3.officersResponsible")}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">
                {t("fr104_3.officerName")}
              </th>

              <th className="border p-2 text-left">
                {t("fr104_3.designation")}
              </th>

              <th className="border p-2 text-center w-32">
                {t("fr104_3.action")}
              </th>
            </tr>
          </thead>

          <tbody>
            {officers.map((officer, index) => (
              <tr key={index}>
                <td className="border p-2">
                  <InputField
                    value={officer.name}
                    onChange={(e) =>
                      updateOfficer(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder={t("fr104_3.officerName")}
                  />
                </td>

                <td className="border p-2">
                  <InputField
                    value={officer.designation}
                    onChange={(e) =>
                      updateOfficer(
                        index,
                        "designation",
                        e.target.value
                      )
                    }
                    placeholder={t("fr104_3.designation")}
                  />
                </td>

                <td className="border p-2 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      removeOfficer(index)
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    {t("fr104_3.removeOfficer")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={addOfficer}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        {t("fr104_3.addOfficer")}
      </button>
    </div>
  );
};

export default OfficersSection;