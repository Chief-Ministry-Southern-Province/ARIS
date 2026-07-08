import { FormField } from "@/components/molecules/FormField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_3Data } from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_3Data;
  handleChange: (
    field: string,
    value: string
  ) => void;
}


const NatureOfLossSection = ({
  formData,
  handleChange,
}: Props) => {

  const { t } = useTranslation();

  return (
    <FormField label={t("fr104_3.natureOfLoss")}>
      <TextAreaField
        rows={4}
        value={formData.natureOfLoss}
        onChange={(e) =>
          handleChange("natureOfLoss", e.target.value)
        }
      />
    </FormField>
  );
};

export default NatureOfLossSection;