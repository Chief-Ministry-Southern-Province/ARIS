import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: string) => void;
}

export default function GeneralInformationSection({
  formData,
  handleChange,
}: Props) {

  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <FormField label={t("fr104_4.generalInformation.referenceNo")} required>
        <InputField
          value={formData.referenceNo}
          onChange={(e) =>
            handleChange("referenceNo", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.generalInformation.ministry")}>
        <InputField
          value={formData.ministry}
          onChange={(e) =>
            handleChange("ministry", e.target.value)
          }
        />
      </FormField>

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

    </div>
  );
}