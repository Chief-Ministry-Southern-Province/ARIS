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

const ApprovalSection = ({
  formData,
  handleChange,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="font-semibold text-lg mb-4">
        {t("fr104_3.approval")}
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField
          label={t("fr104_3.headOfDepartment")}
        >
          <InputField
            value={formData.headOfDepartment}
            onChange={(e) =>
              handleChange(
                "headOfDepartment",
                e.target.value
              )
            }
          />
        </FormField>

        <FormField label={t("fr104_3.date")}>
          <InputField
            type="date"
            value={formData.approvalDate}
            onChange={(e) =>
              handleChange(
                "approvalDate",
                e.target.value
              )
            }
          />
        </FormField>
      </div>
    </div>
  );
};

export default ApprovalSection;