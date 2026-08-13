import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function ReportSection({ formData, setFormData }: Props) {
  const { t } = useTranslation();

  const handleChange = (field: keyof FR109FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  return (
    <FormCard part={t("fr109.parts.b")} title={t("fr109.sections.report")}>
      <div className="space-y-4">
        {/* Preliminary row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-end pb-2 text-sm font-medium text-slate-600">
            {t("fr109.fields.preliminary")}
          </div>

          <FormField label={t("fr109.fields.preliminaryReportReferenceNo")}>
            <InputField
              value={formData.preliminaryReportReferenceNo}
              readOnly
            />
          </FormField>

          <FormField label={t("fr109.fields.preliminaryDate")}>
            <InputField
              type="date"
              value={formData.preliminaryDate}
              onChange={(e) => handleChange("preliminaryDate", e.target.value)}
            />
          </FormField>
        </div>

        {/* Final row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-end pb-2 text-sm font-medium text-slate-600">
            {t("fr109.fields.final")}
          </div>

          <FormField label={t("fr109.fields.finalReportReferenceNo")}>
            <InputField
              value={formData.finalReportReferenceNo}
              readOnly
            />
          </FormField>

          <FormField label={t("fr109.fields.finalDate")}>
            <InputField
              type="date"
              value={formData.finalDate}
              onChange={(e) => handleChange("finalDate", e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </FormCard>
  );
}
