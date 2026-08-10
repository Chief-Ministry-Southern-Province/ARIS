import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR109FormData, SurchargedOfficer } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

const emptyOfficer: SurchargedOfficer = {
  nameOfOfficer: "",
  designation: "",
  amountSurcharged: "",
  amountRecoveredSurcharge: "",
  dateOfRecovery: "",
  receiptNo: "",
  creditParticulars: "",
  balanceNotRecovered: "",
};

export default function LegalActionSection({ formData, setFormData }: Props) {
  const { t } = useTranslation();
  const officers = formData.surchargedOfficers?.length
    ? formData.surchargedOfficers
    : [emptyOfficer];

  const updateOfficer = (
    index: number,
    field: keyof SurchargedOfficer,
    value: string
  ) =>
    setFormData((prev) => {
      const next = prev.surchargedOfficers?.length
        ? [...prev.surchargedOfficers]
        : [emptyOfficer];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, surchargedOfficers: next };
    });

  const addOfficer = () =>
    setFormData((prev) => ({
      ...prev,
      surchargedOfficers: [
        ...(prev.surchargedOfficers?.length ? prev.surchargedOfficers : [emptyOfficer]),
        { ...emptyOfficer },
      ],
    }));

  const removeOfficer = (index: number) =>
    setFormData((prev) => {
      const current = prev.surchargedOfficers?.length
        ? prev.surchargedOfficers
        : [emptyOfficer];
      const next = current.filter((_, i) => i !== index);
      return { ...prev, surchargedOfficers: next.length ? next : [emptyOfficer] };
    });

  return (
    <FormCard
      part={t("fr109.parts.e")}
      title={t("fr109.sections.legalActionAndSurcharges")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FormField label={t("fr109.fields.nameOfCourt")}>
          <InputField
            value={formData.nameOfCourt}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nameOfCourt: e.target.value }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.caseNo")}>
          <InputField
            value={formData.caseNo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, caseNo: e.target.value }))
            }
          />
        </FormField>

      </div>

      <FormField label={t("fr109.fields.outcomeOfLegalAction")}>
        <TextAreaField
          rows={4}
          value={formData.outcomeOfLegalAction}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              outcomeOfLegalAction: e.target.value,
            }))
          }
        />
      </FormField>

      <div className="space-y-6">
        {officers.map((officer, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-slate-200 p-4 pt-6"
          >
            <div className="absolute -top-3 left-4 bg-white px-2 text-xs font-semibold text-slate-500">
              {t("fr109.fields.surchargedOfficer")} {index + 1}
            </div>

            {officers.length > 1 && (
              <button
                type="button"
                onClick={() => removeOfficer(index)}
                className="absolute -top-3 right-4 flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
              >
                <Trash2 size={14} />
                {t("fr109.fields.remove")}
              </button>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField label={t("fr109.fields.nameOfOfficer")}>
                <InputField
                  value={officer.nameOfOfficer}
                  onChange={(e) =>
                    updateOfficer(index, "nameOfOfficer", e.target.value)
                  }
                />
              </FormField>

              <FormField label={t("fr109.fields.designation")}>
                <InputField
                  value={officer.designation}
                  onChange={(e) =>
                    updateOfficer(index, "designation", e.target.value)
                  }
                />
              </FormField>

              <FormField label={t("fr109.fields.amountSurcharged")}>
                <InputField
                  value={officer.amountSurcharged}
                  onChange={(e) =>
                    updateOfficer(index, "amountSurcharged", e.target.value)
                  }
                />
              </FormField>

              <FormField label={t("fr109.fields.amountRecoveredSurcharge")}>
                <InputField
                  value={officer.amountRecoveredSurcharge}
                  onChange={(e) =>
                    updateOfficer(index, "amountRecoveredSurcharge", e.target.value)
                  }
                />
              </FormField>

              <FormField label={t("fr109.fields.dateOfRecovery")}>
                <InputField
                  type="date"
                  value={officer.dateOfRecovery}
                  onChange={(e) =>
                    updateOfficer(index, "dateOfRecovery", e.target.value)
                  }
                />
              </FormField>

              <FormField label={t("fr109.fields.receiptNo")}>
                <InputField
                  value={officer.receiptNo}
                  onChange={(e) =>
                    updateOfficer(index, "receiptNo", e.target.value)
                  }
                />
              </FormField>

              <FormField label={t("fr109.fields.balanceNotRecovered")}>
                <InputField
                  value={officer.balanceNotRecovered}
                  onChange={(e) =>
                    updateOfficer(index, "balanceNotRecovered", e.target.value)
                  }
                />
              </FormField>
            </div>

            <div className="mt-4">
              <FormField label={t("fr109.fields.creditParticulars")}>
                <TextAreaField
                  rows={3}
                  value={officer.creditParticulars}
                  onChange={(e) =>
                    updateOfficer(index, "creditParticulars", e.target.value)
                  }
                />
              </FormField>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOfficer}
        className="mt-4 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-blue-400 hover:text-blue-700"
      >
        <Plus size={16} />
        {t("fr109.fields.addOfficer")}
      </button>
    </FormCard>
  );
}
