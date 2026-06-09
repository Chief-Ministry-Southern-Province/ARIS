import { FormField } from "@/components/molecules/FormField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next"; 

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: any) => void;
}

export default function LossDetailsSection({
  formData,
  handleChange,
}: Props) {

  const { t } = useTranslation();

  return (
    <div className="space-y-4">

      <FormField label={t("fr104_4.lossDetails.particulars")}>
        <TextAreaField
          rows={4}
          value={formData.lossDetails}
          onChange={(e) =>
            handleChange("lossDetails", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.lossDetails.circumstances")}>
        <TextAreaField
          rows={5}
          value={formData.circumstances}
          onChange={(e) =>
            handleChange("circumstances", e.target.value)
          }
        />
      </FormField>

    </div>
  );
}