import { useRef } from "react";
import { Check, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import SignatureCanvasPad from "react-signature-canvas";
import { toast } from "react-toastify";

import type { SignatureCanvasProps } from "@/types/signature.type";

export default function SignatureCanvas({
  onSave,
  onCancel,
  isSaving = false,
}: SignatureCanvasProps) {
  const { t } = useTranslation();
  const signaturePadRef = useRef<SignatureCanvasPad>(null);

  const handleSave = () => {
    const signaturePad = signaturePadRef.current;

    if (!signaturePad || signaturePad.isEmpty()) {
      toast.error("Please draw your signature before saving.");

      return;
    }

    onSave(signaturePad.toDataURL("image/png"));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {t("digitalSignature.drawSignature")}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => signaturePadRef.current?.clear()}
            disabled={isSaving}
            className="
              flex items-center gap-2
              px-3 py-2
              border border-gray-300
              rounded-lg
              hover:bg-gray-50
            "
          >
            <Trash2 size={16} />
            {t("digitalSignature.clear")}
          </button>

          <button
            onClick={onCancel}
            disabled={isSaving}
            className="
              flex items-center gap-2
              px-3 py-2
              border border-red-200
              text-red-600
              rounded-lg
              hover:bg-red-50
            "
          >
            <X size={16} />
            {t("digitalSignature.cancel")}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="
              flex items-center gap-2
              px-3 py-2
              bg-blue-600
              text-white
              rounded-lg
              hover:bg-blue-700
            "
          >
            <Check size={16} />
            {isSaving ? "Saving..." : t("digitalSignature.saveSignature")}
          </button>
        </div>
      </div>

      <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
        <SignatureCanvasPad
          ref={signaturePadRef}
          penColor="#1E40AF"
          minWidth={1}
          maxWidth={3}
          clearOnResize={false}
          canvasProps={{
            width: 700,
            height: 220,
            className: "w-full h-55 bg-slate-50 touch-none cursor-crosshair",
          }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        {t("digitalSignature.drawInstructions")}
      </p>
    </div>
  );
}
