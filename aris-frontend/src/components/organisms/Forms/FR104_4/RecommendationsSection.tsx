import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import type { FR104_4FormData } from "@/types/FR104_4_types";

interface Props {
  handleChange: (
    field: keyof FR104_4FormData,
    value: string | File | null
  ) => void;
}

export default function RecommendationsSection({
  handleChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">


      <FormField
        label={t(
          "fr104_4.recommendations.attachReport"
        )}
      >
        <InputField
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) =>
            handleChange(
              "boardReportFile",
              e.target.files?.[0] || null
            )
          }
        />
      </FormField>

    </div>
  );
}