import {
  PenTool,
  Trash2,
  Upload,
} from "lucide-react";
import type { SignatureActionsProps } from "@/types/signature.type";
import { useTranslation } from "react-i18next";

export default function SignatureActions({
  hasSignature,
  drawMode,
  onDrawToggle,
  onRemove,
}: SignatureActionsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={onDrawToggle}
        className={`
          flex items-center gap-2
          px-4 py-2
          rounded-lg
          border
          transition-colors
          ${
            drawMode
              ? "bg-blue-50 border-blue-500 text-blue-700"
              : "border-gray-300 hover:bg-gray-50"
          }
        `}
      >
        <PenTool className="w-4 h-4" />

        {hasSignature
          ? t("digitalSignature.updateSignature")
          : t("digitalSignature.drawSignature")}
      </button>

      <label
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-lg
          border border-gray-300
          cursor-pointer
          hover:bg-gray-50
        "
      >
        <Upload className="w-4 h-4" />

        {t("digitalSignature.uploadSignature")}

        <input
          type="file"
          accept="image/*"
          className="hidden"
        />
      </label>

      {hasSignature && (
        <button
          onClick={onRemove}
          className="
            flex items-center gap-2
            px-4 py-2
            rounded-lg
            border border-red-200
            text-red-600
            hover:bg-red-50
          "
        >
          <Trash2 className="w-4 h-4" />

          {t("digitalSignature.removeSignature")}
        </button>
      )}
    </div>
  );
}