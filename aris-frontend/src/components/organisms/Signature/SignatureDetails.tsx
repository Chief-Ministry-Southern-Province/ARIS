import { CheckCircle, XCircle, User } from "lucide-react";
import type { SignatureDetailsProps } from "@/types/signature.type";
import { useTranslation } from "react-i18next";

export default function SignatureDetails({
  user,
  hasSignature,
}: SignatureDetailsProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <User className="w-6 h-6 text-blue-600" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            {user.name}
          </h3>

          <p className="text-sm text-gray-500">
            {user.role}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {hasSignature ? (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" />

            <span className="text-green-600 font-medium">
              {t("digitalSignature.signatureAvailable")}
            </span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-500" />

            <span className="text-red-600 font-medium">
              {t("digitalSignature.signatureMissing")}
            </span>
          </>
        )}
      </div>
    </div>
  );
}