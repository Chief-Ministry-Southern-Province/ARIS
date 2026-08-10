import { FormField } from "@/components/molecules/FormField";
import { InputField } from "@/components/atoms/InputField";
import { useTranslation } from "react-i18next";
import type { FR104_4FormData } from "@/types/FR104_4_types";
import { Download, Eye, LoaderCircle, X } from "lucide-react";

interface Props {
  handleChange: (
    field: keyof FR104_4FormData,
    value: string | File | null
  ) => void;
  previewUrl?: string;
  canEditAttachment: boolean;
  attachmentName?: string;
  canRemoveAttachment: boolean;
  onRemoveAttachment: () => void;
  onDownloadAttachment: () => void;
  previewLoading?: boolean;
}

export default function RecommendationsSection({
  handleChange,
  previewUrl,
  canEditAttachment,
  attachmentName,
  canRemoveAttachment,
  onRemoveAttachment,
  onDownloadAttachment,
  previewLoading = false,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">


      {canEditAttachment && (
        <FormField
          label={t("fr104_4.recommendations.attachReport")}
        >
          <InputField
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              handleChange("boardReportFile", e.target.files?.[0] || null)
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

      {(previewUrl || attachmentName) && (
        <div className="flex flex-wrap gap-2">
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
          <a
            href="#download-attachment"
            onClick={(event) => {
              event.preventDefault();
              onDownloadAttachment();
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} /> Download attachment
          </a>
        </div>
      )}

      {previewLoading && (
        <span className="inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-500">
          <LoaderCircle size={16} className="animate-spin" /> Loading preview...
        </span>
      )}

    </div>
  );
}
