import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function ChiefAccountingSection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.h")}
      title={t("fr109.sections.chiefAccountingOfficerOrder")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t("fr109.fields.serialNo")}>
          <InputField
            value={formData.chiefAccountingSerialNo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chiefAccountingSerialNo: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.refNo")}>
          <InputField
            value={formData.chiefAccountingRefNo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chiefAccountingRefNo: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.date")}>
          <InputField
            type="date"
            value={formData.chiefAccountingDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chiefAccountingDate: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.secretaryToMinistryOf")}>
          <InputField
            value={formData.chiefAccountingSecretaryMinistry}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chiefAccountingSecretaryMinistry: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
    </FormCard>
  );
}