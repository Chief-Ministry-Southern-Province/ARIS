import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function ChiefAccountingOfficerOrderSection({ formData, setFormData }: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.i")}
      title={t("fr109.sections.chiefAccountingOfficerOrder")}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={t("fr109.fields.serialNo")}>
          <InputField
            value={formData.chiefAccountingOfficerSTNo}
            onChange={(event) => setFormData((previous) => ({
              ...previous,
              chiefAccountingOfficerSTNo: event.target.value,
            }))}
          />
        </FormField>
        <FormField label={t("fr109.fields.refNo")}>
          <InputField
            value={formData.chiefAccountingOfficerRefNo}
            onChange={(event) => setFormData((previous) => ({
              ...previous,
              chiefAccountingOfficerRefNo: event.target.value,
            }))}
          />
        </FormField>
      </div>
    </FormCard>
  );
}
