import { CheckCircle, XCircle, User } from "lucide-react";
import type { SignatureDetailsProps } from "@/types/signature.type";
import { useTranslation } from "react-i18next";

export default function SignatureDetails({
  user,
  hasSignature,
}: SignatureDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center gap-3 sm:gap-4 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
            {user.name}
          </h3>

          <p className="text-xs sm:text-sm text-gray-500 break-words">
            {user.role}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {hasSignature ? (
          <>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 shrink-0" />

            <span className="text-xs sm:text-sm text-green-600 font-medium">
              {t("digitalSignature.signatureAvailable")}
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />

            <span className="text-xs sm:text-sm text-red-600 font-medium">
              {t("digitalSignature.signatureMissing")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}