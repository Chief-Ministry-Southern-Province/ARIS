import { FormField } from "@/components/molecules/FormField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: any) => void;
}

export default function InvestigationSection({
  formData,
  handleChange,
}: Props) {

  const { t } = useTranslation();
  
  return (
    <FormField label={t("fr104_4.investigation.findings")}>
      <TextAreaField
        rows={6}
        value={formData.investigation}
        onChange={(e) =>
          handleChange("investigation", e.target.value)
        }
      />
    </FormField>
  );
}