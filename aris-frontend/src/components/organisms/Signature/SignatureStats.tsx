import { CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { SignatureStatsProps } from "@/types/signature.type";

export default function SignatureStats({
  users,
  signatures,
}: SignatureStatsProps) {
  const { t } = useTranslation();

  const signedCount = users.filter(
    (user) => signatures[user.id]
  ).length;

  const unsignedCount =
    users.length - signedCount;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-800 mb-4">
        Signature Status
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-green-200 bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" />

            <div>
              <p className="text-sm text-gray-500">
                {t(
                  "digitalSignature.signatureAvailable"
                )}
              </p>

              <p className="text-2xl font-bold text-green-700">
                {signedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-red-200 bg-red-50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" />

            <div>
              <p className="text-sm text-gray-500">
                {t(
                  "digitalSignature.signatureMissing"
                )}
              </p>

              <p className="text-2xl font-bold text-red-700">
                {unsignedCount}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="
              flex items-center
              justify-between
              p-3
              border
              rounded-lg
            "
          >
            <div>
              <p className="font-medium text-sm">
                {user.name}
              </p>

              <p className="text-xs text-gray-500">
                {user.role}
              </p>
            </div>

            {signatures[user.id] ? (
              <span className="text-green-600 text-sm font-medium">
                ✓ Signed
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">
                ✗ Missing
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}