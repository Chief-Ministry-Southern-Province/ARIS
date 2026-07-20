import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function NonRecoverySection({
  formData,
  setFormData,
}: Props) {
  const { t } = useTranslation();

  return (
    <FormCard
      part={t("fr109.parts.f")}
      title={t("fr109.sections.nonRecoveryAndAction")}
    >
      <FormField label={t("fr109.fields.reasonsForNonRecovery")}>
        <TextAreaField
          rows={4}
          value={formData.reasonsForNonRecovery}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              reasonsForNonRecovery: e.target.value,
            }))
          }
        />
      </FormField>

      <div className="mt-4">
        <FormField label={t("fr109.fields.actionTakenDetails")}>
          <TextAreaField
            rows={4}
            value={formData.actionTakenDetails}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                actionTakenDetails: e.target.value,
              }))
            }
          />
        </FormField>
      </div>

      <div className="mt-4">
        <FormField label={t("fr109.fields.resultsOfAction")}>
          <TextAreaField
            rows={4}
            value={formData.resultsOfAction}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                resultsOfAction: e.target.value,
              }))
            }
          />
        </FormField>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label={t("fr109.fields.chiefAccountantDate")}>
          <InputField
            type="date"
            value={formData.chiefAccountantDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chiefAccountantDate: e.target.value,
              }))
            }
          />
        </FormField>

        <FormField label={t("fr109.fields.chiefAccountantSignature")}>
          <InputField
            value={formData.chiefAccountantSignature}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                chiefAccountantSignature: e.target.value,
              }))
            }
          />
        </FormField>
      </div>
    </FormCard>
  );
}