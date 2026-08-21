import { useTranslation } from "react-i18next";
import { FormCard } from "@/components/molecules/FormCard";
import { FormField } from "@/components/molecules/FormField";
import type { FR109FormData } from "@/types/FR109.type";

interface Props {
  formData: FR109FormData;
  setFormData: React.Dispatch<React.SetStateAction<FR109FormData>>;
}

export default function WriteOffDecisionSection({ formData, setFormData }: Props) {
  const { t } = useTranslation();

  return (
    <FormCard part={t("fr109.parts.j")} title={t("fr109.sections.writeOffDecision")}>
      <FormField label={t("fr109.fields.writeOffStatus")}>
        <div className="flex flex-wrap gap-5 pt-2 text-sm font-medium text-slate-700">
          <label className="flex items-center gap-2"><input type="radio" name="writeOffStatus" value="AUTHORISED" checked={formData.writeOffStatus === "AUTHORISED"} onChange={() => setFormData((previous) => ({ ...previous, writeOffStatus: "AUTHORISED" }))} />{t("fr109.fields.authorised")}</label>
          <label className="flex items-center gap-2"><input type="radio" name="writeOffStatus" value="NOT_APPROVED" checked={formData.writeOffStatus === "NOT_APPROVED"} onChange={() => setFormData((previous) => ({ ...previous, writeOffStatus: "NOT_APPROVED" }))} />{t("fr109.fields.notApproved")}</label>
        </div>
      </FormField>
    </FormCard>
  );
}
