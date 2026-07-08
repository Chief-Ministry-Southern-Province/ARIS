import { InputField } from "@/components/atoms/InputField";
import type {
  FR104_3Data,
  Officer,
} from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, User } from "lucide-react";

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
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <button
          type="button"
          onClick={addOfficer}
          className="
            flex items-center justify-center gap-2
            px-4 py-2
            text-blue-600
            rounded-xl
            transition
          "
        >
          <Plus size={16} />
          {t("fr104_3.addOfficer")}
        </button>
      </div>

      {/* Officer Cards */}
      <div className="space-y-4">
        {officers.map((officer, index) => (
          <div
            key={index}
            className="
              rounded-xl
              border border-slate-200
              bg-white
              p-4
              shadow-sm
            "
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User
                  size={18}
                  className="text-blue-600"
                />

                <h4 className="font-medium text-slate-800">
                  Officer #{index + 1}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => removeOfficer(index)}
                className="
                  flex items-center justify-center
                  w-9 h-9
                  rounded-lg
                  text-red-600
                  hover:bg-red-50
                  transition
                "
                title={t("fr104_3.remove")}
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficersSection;