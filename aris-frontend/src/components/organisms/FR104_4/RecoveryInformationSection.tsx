import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (field: keyof FR104_4FormData, value: string) => void;
}

export default function RecoveryInformationSection({
  formData,
  handleChange,
}: Props) {

  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-3 gap-4">

      <FormField label={t("fr104_4.recovery.officer")}>
        <InputField
          value={formData.recoveryOfficer}
          onChange={(e) =>
            handleChange("recoveryOfficer", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.recovery.amount")}>
        <InputField
          type="number"
          value={formData.recoveryAmount}
          onChange={(e) =>
            handleChange("recoveryAmount", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_4.recovery.method")}>
        <InputField
          value={formData.recoveryMethod}
          onChange={(e) =>
            handleChange("recoveryMethod", e.target.value)
          }
        />
      </FormField>

    </div>
  );
}