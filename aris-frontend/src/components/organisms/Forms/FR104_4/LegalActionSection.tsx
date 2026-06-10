import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (
    field: keyof FR104_4FormData,
    value: string | File | null
  ) => void;
}

export default function LegalActionSection({
  formData,
  handleChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">

      <div className="grid md:grid-cols-2 gap-4">

        <FormField
          label={t(
            "fr104_4.legalAction.courtName"
          )}
        >
          <InputField
            value={formData.courtName}
            onChange={(e) =>
              handleChange(
                "courtName",
                e.target.value
              )
            }
          />
        </FormField>

        <FormField
          label={t(
            "fr104_4.legalAction.caseNo"
          )}
        >
          <InputField
            value={formData.courtCaseNo}
            onChange={(e) =>
              handleChange(
                "courtCaseNo",
                e.target.value
              )
            }
          />
        </FormField>

      </div>

      <FormField
        label={t(
          "fr104_4.legalAction.courtOrderSummary"
        )}
      >
        <TextAreaField
          rows={5}
          value={formData.courtOrderSummary}
          onChange={(e) =>
            handleChange(
              "courtOrderSummary",
              e.target.value
            )
          }
        />
      </FormField>

      <FormField
        label={t(
          "fr104_4.legalAction.attachOrder"
        )}
      >
        <InputField
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={(e) =>
            handleChange(
              "courtOrderFile",
              e.target.files?.[0] || null
            )
          }
        />
      </FormField>

    </div>
  );
}