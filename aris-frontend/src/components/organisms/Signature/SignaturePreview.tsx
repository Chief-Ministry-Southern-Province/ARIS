import { LoaderCircle, PenTool } from "lucide-react";
import type { SignaturePreviewProps } from "@/types/signature.type";
import { useTranslation } from "react-i18next";
import SignatureCaptionPreview from "@/components/organisms/Signature/SignatureCaptionPreview";

export default function SignaturePreview({
  user,
  signature,
  caption,
  isLoading = false,
}: SignaturePreviewProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4">
        {t("digitalSignature.signaturePreview")}
      </h3>

      <div className="min-h-44 sm:min-h-52 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center p-3 sm:p-4">
        {isLoading ? (
          <div className="text-center">
            <LoaderCircle className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3 animate-spin" />

            <p className="text-xs sm:text-sm text-gray-500">Loading signature...</p>
          </div>
        ) : signature ? (
          <div className="text-center w-full overflow-hidden">
            <img
              src={signature}
              alt={`${user.name}'s signature`}
              className="max-h-28 sm:max-h-36 max-w-full object-contain mx-auto"
            />

            <SignatureCaptionPreview user={user} caption={caption} />
          </div>
        ) : (
          <div className="text-center">
            <PenTool className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />

            <p className="text-xs sm:text-sm text-gray-400">
              {t("digitalSignature.signatureMissing")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
