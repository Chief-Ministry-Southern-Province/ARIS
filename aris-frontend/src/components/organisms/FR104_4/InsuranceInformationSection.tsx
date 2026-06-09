import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import type { FR104_4FormData } from "@/types/FR104_4_types";

interface Props {
  formData: FR104_4FormData;
  handleChange: (
    field: keyof FR104_4FormData,
    value: string
  ) => void;
}

export default function InsuranceInformationSection({
  formData,
  handleChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">

      <FormField
        label={t(
          "fr104_4.insurance.recoverableAmountWords"
        )}
      >
        <InputField
          value={
            formData.insuranceRecoverableAmountWords
          }
          onChange={(e) =>
            handleChange(
              "insuranceRecoverableAmountWords",
              e.target.value
            )
          }
        />
      </FormField>

      <div className="grid md:grid-cols-3 gap-4">

        <FormField
          label={t(
            "fr104_4.insurance.policyNo"
          )}
        >
          <InputField
            value={formData.policyNo}
            onChange={(e) =>
              handleChange(
                "policyNo",
                e.target.value
              )
            }
          />
        </FormField>

        <FormField
          label={t(
            "fr104_4.insurance.amountInsured"
          )}
        >
          <InputField
            type="number"
            value={formData.amountInsured}
            onChange={(e) =>
              handleChange(
                "amountInsured",
                e.target.value
              )
            }
          />
        </FormField>

        <FormField
          label={t(
            "fr104_4.insurance.amountRecoverable"
          )}
        >
          <InputField
            type="number"
            value={formData.amountRecoverable}
            onChange={(e) =>
              handleChange(
                "amountRecoverable",
                e.target.value
              )
            }
          />
        </FormField>

      </div>

    </div>
  );
}