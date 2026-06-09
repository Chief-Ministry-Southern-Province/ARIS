import { FormField } from "@/components/molecules/FormField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_4FormData;
  handleChange: (
    field: keyof FR104_4FormData,
    value: string
  ) => void;
}

export default function PreventiveActionsSection({
  formData,
  handleChange,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormField
      label={t(
        "fr104_4.preventiveActions.label"
      )}
    >
      <TextAreaField
        rows={8}
        placeholder={t(
          "fr104_4.preventiveActions.placeholder"
        )}
        value={formData.preventiveActions}
        onChange={(e) =>
          handleChange(
            "preventiveActions",
            e.target.value
          )
        }
      />
    </FormField>
  );
}