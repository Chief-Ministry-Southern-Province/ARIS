import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function HeadOfDepartmentOrderSection({ formData, setFormData }: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.h")}
      title={t("fr109.sections.headOfDepartmentOrder")}
    >
      <FormField label={t("fr109.fields.secretaryToMinistryOf")}>
        <InputField
          value={formData.secretaryOfMinistry}
          onChange={(event) =>
            setFormData((previous) => ({
              ...previous,
              secretaryOfMinistry: event.target.value,
            }))
          }
        />
      </FormField>
    </FormCard>
  );
}
