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

      <FormField label={t("fr104_4.generalInformation.ministry")}>
        <InputField
          value={formData.ministry}
          onChange={(e) =>
            handleChange("ministry", e.target.value)
          }
        />
      </FormField>

      <FormField
        label={t(
          "fr104_4.generalInformation.preliminaryReportRefNo"
        )}
      >
        <InputField
          value={formData.preliminaryReportRefNo}
          onChange={(e) =>
            handleChange(
              "preliminaryReportRefNo",
              e.target.value
            )
          }
        />
      </FormField>

      <FormField
        label={t(
          "fr104_4.generalInformation.preliminaryReportDate"
        )}
      >
        <InputField
          type="date"
          value={formData.preliminaryReportDate}
          onChange={(e) =>
            handleChange(
              "preliminaryReportDate",
              e.target.value
            )
          }
        />
      </FormField>

    </div>
  );
}