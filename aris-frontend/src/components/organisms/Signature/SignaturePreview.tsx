import { LoaderCircle, PenTool } from "lucide-react";
import type { SignaturePreviewProps } from "@/types/signature.type";
import { useTranslation } from "react-i18next";

export default function SignaturePreview({
  user,
  signature,
  isLoading = false,
}: SignaturePreviewProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-4">
        {t("digitalSignature.signaturePreview")}
      </h3>

      <div className="min-h-55 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
        {isLoading ? (
          <div className="text-center">
            <LoaderCircle className="w-8 h-8 text-blue-600 mx-auto mb-3 animate-spin" />

            <p className="text-sm text-gray-500">Loading signature...</p>
          </div>
        ) : signature ? (
          <div className="text-center">
            <img
              src={signature}
              alt={`${user.name}'s signature`}
              className="max-h-32 mx-auto"
            />

            <p className="text-sm text-gray-500 mt-3">
              {user.name}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <PenTool className="w-12 h-12 text-gray-300 mx-auto mb-3" />

            <p className="text-gray-400">
              {t("digitalSignature.signatureMissing")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
