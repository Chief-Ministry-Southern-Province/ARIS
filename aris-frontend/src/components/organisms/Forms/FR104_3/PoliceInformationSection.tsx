import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";

interface Props {
  formData: any;
  handleChange: (
    field: string,
    value: string
  ) => void;
}

const PoliceInformationSection = ({
  formData,
  handleChange,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <FormField label={t("fr104_3.policeStation")}>
        <InputField
          value={formData.policeStation}
          onChange={(e) =>
            handleChange(
              "policeStation",
              e.target.value
            )
          }
        />
      </FormField>

      <FormField label={t("fr104_3.dateReported")}>
        <InputField
          type="date"
          value={formData.policeReportDate}
          onChange={(e) =>
            handleChange(
              "policeReportDate",
              e.target.value
            )
          }
        />
      </FormField>
    </div>
  );
};

export default PoliceInformationSection;