import { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(700);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(() => {
      updateWidth();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleSave = () => {
    const signaturePad = signaturePadRef.current;

    if (!signaturePad || signaturePad.isEmpty()) {
      toast.error("Please draw your signature before saving.");

      return;
    }

    onSave(signaturePad.toDataURL("image/png"));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
          {t("digitalSignature.drawSignature")}
        </h3>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => signaturePadRef.current?.clear()}
            disabled={isSaving}
            className="
              flex-1 sm:flex-none flex items-center justify-center gap-1.5
              px-3 py-2 text-xs sm:text-sm font-medium
              border border-gray-300 rounded-lg text-gray-700
              hover:bg-gray-50 transition-colors
            "
          >
            <Trash2 className="w-4 h-4 shrink-0" />
            <span>{t("digitalSignature.clear")}</span>
          </button>

          <button
            onClick={onCancel}
            disabled={isSaving}
            className="
              flex-1 sm:flex-none flex items-center justify-center gap-1.5
              px-3 py-2 text-xs sm:text-sm font-medium
              border border-red-200 text-red-600 rounded-lg
              hover:bg-red-50 transition-colors
            "
          >
            <X className="w-4 h-4 shrink-0" />
            <span>{t("digitalSignature.cancel")}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="
              w-full sm:w-auto flex items-center justify-center gap-1.5
              px-4 py-2 text-xs sm:text-sm font-medium
              bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 transition-colors disabled:opacity-50
            "
          >
            <Check className="w-4 h-4 shrink-0" />
            <span>{isSaving ? "Saving..." : t("digitalSignature.saveSignature")}</span>
          </button>
        </div>
      </div>

      <div ref={containerRef} className="border-2 border-blue-200 rounded-xl overflow-hidden bg-slate-50">
        <SignatureCanvasPad
          ref={signaturePadRef}
          penColor="#1E40AF"
          minWidth={1}
          maxWidth={3}
          clearOnResize={false}
          canvasProps={{
            width: canvasWidth,
            height: 220,
            className: "w-full h-48 sm:h-56 bg-slate-50 touch-none cursor-crosshair",
          }}
        />
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        {t("digitalSignature.drawInstructions")}
      </p>
    </div>
  );
}
