import { FormField } from "@/components/molecules/FormField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next"; 
import { InputField } from "@/components/atoms/InputField";

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

      <FormField label={t("fr104_4.generalInformation.lossDate")}>
        <InputField
          type="date"
          value={formData.lossDate}
          onChange={(e) =>
            handleChange("lossDate", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.generalInformation.lossTime")}>
        <InputField
          type="time"
          value={formData.lossTime}
          onChange={(e) =>
            handleChange("lossTime", e.target.value)
          }
        />
      </FormField>

      <div className="md:col-span-2">
        <FormField label={t("fr104_4.generalInformation.location")} required>
          <InputField
            value={formData.location}
            onChange={(e) =>
              handleChange("location", e.target.value)
            }
          />
        </FormField>
      </div>

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