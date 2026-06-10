import { useState } from "react";
import { useTranslation } from "react-i18next";

import SignatureDetails from "@/components/organisms/Signature/SignatureDetails";
import SignaturePreview from "@/components/organisms/Signature/SignaturePreview";
import SignatureActions from "@/components/organisms/Signature/SignatureActions";
import SignatureCanvas from "@/components/organisms/Signature/SignatureCanvas";
import { mockUsers } from "../data/mockData";

import type {
  SignatureMap,
  Signatory,
} from "@/types/signature.type";

const signatories: Signatory[] = mockUsers.filter(
  (user) => user.role !== "Driver"
);

export default function DigitalSignatures() {
  const { t } = useTranslation();

  const [drawMode, setDrawMode] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(signatories[0]?.id ?? "");

  const [signatures, setSignatures] =
    useState<SignatureMap>({
      U002: "sig_nimal",
      U003: "sig_saman",
    });

  const selectedOfficer =
    signatories.find(
      (user) => user.id === selectedUser
    ) ?? signatories[0];

  const hasSignature =
    !!signatures[selectedUser];

  const handleSaveSignature = (
    signature: string
  ) => {
    setSignatures((prev) => ({
      ...prev,
      [selectedUser]: signature,
    }));

    setDrawMode(false);
  };

  const handleRemoveSignature = () => {
    setSignatures((prev) => {
      const updated = { ...prev };

      delete updated[selectedUser];

      return updated;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("digitalSignature.title")}
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          {t("digitalSignature.description")}
        </p>
      </div>

      <div className="space-y-4">
        {/* Officer Selector */}

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("digitalSignature.searchOfficer")}
          </label>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="
              w-full
              px-3 py-2.5
              border border-gray-300
              rounded-lg
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          >
            {signatories.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.role})
              </option>
            ))}
          </select>
        </div>

        <SignatureDetails
          user={selectedOfficer}
          hasSignature={hasSignature}
        />

        <SignaturePreview
          user={selectedOfficer}
          signature={signatures[selectedUser]}
        />

        <SignatureActions
          hasSignature={hasSignature}
          drawMode={drawMode}
          onDrawToggle={() => setDrawMode((prev) => !prev)}
          onRemove={handleRemoveSignature}
        />

        {drawMode && (
          <SignatureCanvas
            onSave={handleSaveSignature}
            onCancel={() => setDrawMode(false)}
          />
        )}
      </div>
    </div>
  );
}