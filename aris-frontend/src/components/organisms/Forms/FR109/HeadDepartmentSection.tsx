import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function HeadDepartmentSection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.g")}
      title={t("fr109.sections.headOfDepartmentOrder")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t("fr109.fields.secretaryToMinistryOf")}>
          <InputField
            value={formData.headOfDeptSecretaryMinistry}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                headOfDeptSecretaryMinistry: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.date")}>
          <InputField
            type="date"
            value={formData.headOfDeptDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                headOfDeptDate: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
    </FormCard>
  );
}