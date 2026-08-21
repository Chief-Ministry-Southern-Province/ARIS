import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function ValueOfLossSection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.d")}
      title={t("fr109.sections.valueOfLoss")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t("fr109.fields.originalCost")}>
          <InputField
            type="number"
            min="0"
            step="0.01"
            value={formData.originalCost}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                originalCost: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.estimatedCostAtTimeOfLoss")}>
          <InputField
            value={formData.estimatedCostAtTimeOfLoss}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                estimatedCostAtTimeOfLoss: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.replacementValue")}>
          <InputField
            value={formData.replacementValue}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                replacementValue: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.valueUnderFr105")}>
          <InputField
            value={formData.valueUnderFr105}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                valueUnderFr105: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.amountRecovered")}>
          <InputField
            value={formData.amountRecovered}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amountRecovered: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.netLoss")}>
          <InputField
            type="number"
            min="0"
            step="0.01"
            value={formData.netLoss}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                netLoss: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
    </FormCard>
  );
}
