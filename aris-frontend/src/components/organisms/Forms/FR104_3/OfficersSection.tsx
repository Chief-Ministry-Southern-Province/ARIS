import { InputField } from "@/components/atoms/InputField";
import type {
  FR104_3Data,
  Officer,
} from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";

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
    <div className="space-y-4">

      <div className="flex items-center justify-between">

        <div>
          <h3 className="font-semibold text-slate-800">
            {t("fr104_3.officersResponsible")}
          </h3>

          <p className="text-sm text-slate-500">
            {t(
              "fr104_3.officersResponsibleDescription"
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={addOfficer}
          className="
            flex items-center gap-2
            px-4 py-2
            bg-blue-600
            text-white
            rounded-xl
            hover:bg-blue-700
            transition
          "
        >
          <Plus size={16} />
          {t("fr104_3.addOfficer")}
        </button>

      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-100 text-slate-700">

              <th className="px-4 py-3 text-left font-semibold">
                {t("fr104_3.officerName")}
              </th>

              <th className="px-4 py-3 text-left font-semibold">
                {t("fr104_3.designation")}
              </th>

              <th className="px-4 py-3 text-center font-semibold w-24">
                {t("fr104_3.action")}
              </th>

            </tr>
          </thead>

          <tbody>

            {officers.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="
                    text-center
                    py-8
                    text-slate-500
                  "
                >
                  {t("fr104_3.noOfficers")}
                </td>
              </tr>
            )}

            {officers.map((officer, index) => (
              <tr
                key={index}
                className="border-t border-slate-200"
              >

                <td className="p-3">
                  <InputField
                    value={officer.name}
                    onChange={(e) =>
                      updateOfficer(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder={t(
                      "fr104_3.officerName"
                    )}
                  />
                </td>

                <td className="p-3">
                  <InputField
                    value={officer.designation}
                    onChange={(e) =>
                      updateOfficer(
                        index,
                        "designation",
                        e.target.value
                      )
                    }
                    placeholder={t(
                      "fr104_3.designation"
                    )}
                  />
                </td>

                <td className="p-3 text-center">
                  <button
                    type="button"
                    onClick={() =>
                      removeOfficer(index)
                    }
                    className="
                      inline-flex
                      items-center
                      justify-center
                      w-10 h-10
                      rounded-lg
                      text-red-600
                      hover:bg-red-50
                    "
                  >
                    <Trash2 size={18} />
                  </button>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default OfficersSection;