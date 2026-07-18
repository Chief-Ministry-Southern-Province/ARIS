import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { SelectField } from "@/components/atoms/SelectField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
  editable: boolean;
}

export default function WriteOffDecisionSection({
  formData,
  setFormData,
  editable,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.i")}
      title={t("fr109.sections.writeOffDecision")}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t("fr109.fields.secretaryToMinistryOf")}>
          <InputField
            value={formData.writeOffSecretaryMinistry}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                writeOffSecretaryMinistry: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.refNo")}>
          <InputField
            value={formData.writeOffRefNo}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                writeOffRefNo: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.date")}>
          <InputField
            type="date"
            value={formData.writeOffDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                writeOffDate: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.writeOffStatus")}>
          <SelectField
            value={formData.writeOffStatus}
            disabled={!editable}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                writeOffStatus: e.target.value as FR109FormData["writeOffStatus"],
              }))
            }
            options={[]}
          >
            <option value="">—</option>
            <option value="AUTHORISED">
              {t("fr109.fields.authorised")}
            </option>
            <option value="NOT_APPROVED">
              {t("fr109.fields.notApproved")}
            </option>
          </SelectField>
        </FormField>
      </div>
    </FormCard>
  );
}