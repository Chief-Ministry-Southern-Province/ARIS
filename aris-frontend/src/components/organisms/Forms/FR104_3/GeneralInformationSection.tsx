import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type {FR104_3Data} from "@/types/form_104_3_types";
import { useTranslation } from "react-i18next";

interface Props {
  formData: FR104_3Data;
  handleChange: (
    field: string,
    value: string
  ) => void;
}

const GeneralInformationSection = ({
  formData,
  handleChange,
}: Props) => {

  const { t } = useTranslation();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField label={t("fr104_3.department")}>
        <InputField
          value={formData.department}
          onChange={(e) =>
            handleChange(
              "department",
              e.target.value
            )
          }
        />
      </FormField>

      <div className="md:col-span-2 border-t border-gray-200 pt-4">
        <h3 className="text-base font-semibold text-gray-800">
          {t("fr104_3.loss")}
        </h3>
      </div>

      <FormField label={t("fr104_3.date")}>
        <InputField
          type="date"
          value={formData.date}
          onChange={(e) =>
            handleChange("date", e.target.value)
          }
        />
      </FormField>

      <FormField label={t("fr104_3.place")}>
        <InputField
          value={formData.place}
          onChange={(e) =>
            handleChange(
              "place",
              e.target.value
            )
          }
        />
      </FormField>

    </div>
  );
};

export default GeneralInformationSection;
