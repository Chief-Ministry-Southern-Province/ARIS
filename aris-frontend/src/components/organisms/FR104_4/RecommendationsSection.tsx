import { FormField } from "@/components/molecules/FormField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: string) => void;
}

export default function RecommendationsSection({
  formData,
  handleChange,
}: Props) {

  const { t } = useTranslation();

  return (
    <FormField label={t("fr104_4.recommendations.label")}>
      <TextAreaField
        rows={6}
        value={formData.recommendations}
        onChange={(e) =>
          handleChange("recommendations", e.target.value)
        }
      />
    </FormField>
  );
}