import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: string) => void;
}

export default function PoliceInformationSection({
  formData,
  handleChange,
}: Props) {

  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-2 gap-4">

      <FormField label={t("fr104_4.police.station")}>
        <InputField
          value={formData.policeStation}
          onChange={(e) =>
            handleChange("policeStation", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.police.caseNumber")}>
        <InputField
          value={formData.caseNumber}
          onChange={(e) =>
            handleChange("caseNumber", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.police.officerName")}>
        <InputField
          value={formData.officerName}
          onChange={(e) =>
            handleChange("officerName", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.police.reportDate")}>
        <InputField
          type="date"
          value={formData.reportDate}
          onChange={(e) =>
            handleChange("reportDate", e.target.value)
          }
        />
      </FormField>

    </div>
  );
}