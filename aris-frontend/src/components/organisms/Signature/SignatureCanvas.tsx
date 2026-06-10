import { useEffect } from "react";
import { Check, Trash2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SignatureCanvasProps } from "@/types/signature.type";
import { useSignatureCanvas } from "@/hooks/useSignatureCanvas";

export default function SignatureCanvas({
  onSave,
  onCancel,
}: SignatureCanvasProps) {
  
  const { t } = useTranslation();

  const {
    canvasRef,
    initializeCanvas,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    saveCanvas,
  } = useSignatureCanvas();

  useEffect(() => {
    initializeCanvas();
  }, [initializeCanvas]);

  const handleSave = () => {
    const signature = saveCanvas();

    if (signature) {
      onSave(signature);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-800">
          {t("digitalSignature.drawSignature")}
        </h3>

        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
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
            {t("digitalSignature.saveSignature")}
          </button>
        </div>
      </div>

      <div className="border-2 border-blue-200 rounded-xl overflow-hidden">
        <canvas
          ref={canvasRef}
          width={700}
          height={220}
          className="
            w-full
            bg-slate-50
            touch-none
            cursor-crosshair
          "
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        {t("digitalSignature.drawInstructions")}
      </p>
    </div>
  );
}