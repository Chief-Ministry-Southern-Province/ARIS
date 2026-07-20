import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function PropertySection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.c")}
      title={t("fr109.sections.particularsOfProperty")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <FormField label={t("fr109.fields.descriptionOfProperty")}>
            <TextAreaField
              rows={4}
              value={formData.descriptionOfProperty}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  descriptionOfProperty: e.target.value,
                }))
              }
            />
          </FormField>
        </div>

        <FormField label={t("fr109.fields.quantity")}>
          <InputField
            value={formData.quantity}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                quantity: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
    </FormCard>
  );
}