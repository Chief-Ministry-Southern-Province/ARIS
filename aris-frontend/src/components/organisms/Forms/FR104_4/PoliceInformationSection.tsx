import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (
    field: keyof FR104_4FormData,
    value: string | File | null
  ) => void;
}

export default function PoliceInformationSection({
  formData,
  handleChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">


      <FormField
        label={t(
          "fr104_4.police.attachReport"
        )}
      >
        <InputField
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          onChange={(e) =>
            handleChange(
              "policeReportFile",
              e.target.files?.[0] || null
            )
          }
        />
      </FormField>

      {formData.policeReportFile instanceof File && (
        <p className="text-sm text-green-600">
          {formData.policeReportFile.name}
        </p>
      )}

    </div>
  );
}
