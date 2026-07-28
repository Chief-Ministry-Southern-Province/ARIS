import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { TextAreaField } from "@/components/atoms/TextAreaField";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { useTranslation } from "react-i18next";
import { Eye, LoaderCircle, X } from "lucide-react";

interface Props {
  formData: FR104_4FormData;
  handleChange: (
    field: keyof FR104_4FormData,
    value: string | File | null
  ) => void;
  previewUrl?: string;
  canEditAttachment: boolean;
  attachmentName?: string;
  canRemoveAttachment: boolean;
  onRemoveAttachment: () => void;
  previewLoading?: boolean;
}

export default function LegalActionSection({
  formData,
  handleChange,
  previewUrl,
  canEditAttachment,
  attachmentName,
  canRemoveAttachment,
  onRemoveAttachment,
  previewLoading = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">

      <div className="grid md:grid-cols-2 gap-4">

        <FormField
          label={t(
            "fr104_4.legalAction.courtName"
          )}
        >
          <InputField
            value={formData.courtName}
            onChange={(e) =>
              handleChange(
                "courtName",
                e.target.value
              )
            }
          />
        </FormField>

        <FormField
          label={t(
            "fr104_4.legalAction.caseNo"
          )}
        >
          <InputField
            value={formData.courtCaseNo}
            onChange={(e) =>
              handleChange(
                "courtCaseNo",
                e.target.value
              )
            }
          />
        </FormField>

      </div>

      <FormField
        label={t(
          "fr104_4.legalAction.courtOrderSummary"
        )}
      >
        <TextAreaField
          rows={5}
          value={formData.courtOrderSummary}
          onChange={(e) =>
            handleChange(
              "courtOrderSummary",
              e.target.value
            )
          }
        />
      </FormField>

      {canEditAttachment && (
        <FormField
          label={t("fr104_4.legalAction.attachOrder")}
        >
          <InputField
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) =>
              handleChange("courtOrderFile", e.target.files?.[0] || null)
            }
          />
        </FormField>
      )}

      {attachmentName && canEditAttachment && (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
          <span className="min-w-0 flex-1 truncate text-slate-700">{attachmentName}</span>
          {canRemoveAttachment && (
            <button type="button" onClick={onRemoveAttachment} className="inline-flex items-center gap-1 text-red-600 hover:text-red-700">
              <X size={15} /> Remove
            </button>
          )}
        </div>
      )}

      {previewUrl && (
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          <Eye size={16} /> Preview attachment
        </a>
      )}

      {previewLoading && (
        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
          <LoaderCircle size={16} className="animate-spin" /> Loading preview...
        </span>
      )}

    </div>
  );
}
