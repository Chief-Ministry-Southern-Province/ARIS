import { InputField } from "@/components/atoms/InputField";
import type { FR104_3Data, Officer } from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";
import { Plus, Trash2, User } from "lucide-react";
import { FormField } from "@/components/molecules/FormField";

interface OfficersSectionProps {
  formData: FR104_3Data;
  addOfficer: () => void;
  updateOfficer: (index: number, field: keyof Officer, value: string) => void;
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
            text-sm font-medium
            border border-blue-200 bg-blue-50 text-blue-700
            rounded-lg
            hover:bg-blue-100
            dark:border-blue-700/70 dark:bg-blue-950/65 dark:text-blue-300 dark:hover:bg-blue-900/65
            transition-colors
          "
        >
          <Plus size={18} />
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
              border border-slate-200 bg-white
              p-4
              shadow-sm
              dark:border-slate-700 dark:bg-slate-950/35
            "
          >
            {/* Card Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/75 dark:text-blue-200">
                  <User size={14} />
                </span>
                <h4 className="font-medium text-slate-700 dark:text-slate-200">
                  {t("fr104_3.officer")} #{index + 1}
                </h4>
              </div>

              {officers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeOfficer(index)}
                  className="
                    flex items-center justify-center
                    w-9 h-9
                    rounded-lg
                    text-red-600
                    hover:bg-red-50
                    transition-colors
                  "
                  title={t("fr104_3.remove")}
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label={t("fr104_3.officerName")}>
                <InputField
                  value={officer.name}
                  onChange={(e) =>
                    updateOfficer(index, "name", e.target.value)
                  }
                  placeholder={t("fr104_3.officerName")}
                />
              </FormField>

              <FormField label={t("fr104_3.designation")}>
                <InputField
                  value={officer.designation}
                  onChange={(e) =>
                    updateOfficer(index, "designation", e.target.value)
                  }
                  placeholder={t("fr104_3.designation")}
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficersSection;
