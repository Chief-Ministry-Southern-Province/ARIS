import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import UserSearchPanel from "@/components/organisms/Signature/UserSearchPanel";
import UserList from "@/components/organisms/Signature/UserList";
import SignatureDetails from "@/components/organisms/Signature/SignatureDetails";
import SignaturePreview from "@/components/organisms/Signature/SignaturePreview";
import SignatureActions from "@/components/organisms/Signature/SignatureActions";
import SignatureCanvas from "@/components/organisms/Signature/SignatureCanvas";
import SignatureStats from "@/components/organisms/Signature/SignatureStats";

import { mockUsers } from "../data/mockData";

import type {SignatureMap, Signatory} from "@/types/signature.type";

const signatories: Signatory[] = mockUsers.filter(
  (user) => user.role !== "Driver"
);

export default function DigitalSignatures() {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [drawMode, setDrawMode] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState(signatories[0]?.id ?? "");

  const [signatures, setSignatures] =
    useState<SignatureMap>({
      U002: "sig_nimal",
      U003: "sig_saman",
    });

  const filteredUsers = useMemo(() => {
    return signatories.filter(
      (user) =>
        user.name
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          ) ||
        user.role
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase()
          )
    );
  }, [searchTerm]);

  const selectedUserData =
    signatories.find(
      (user) => user.id === selectedUser
    );

  if (!selectedUserData) {
    return (
      <div className="p-6">
        No users found
      </div>
    );
  }

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

      {/* Content */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel */}

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <UserSearchPanel
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <UserList
            users={filteredUsers}
            selectedUser={selectedUser}
            signatures={signatures}
            onSelect={setSelectedUser}
          />
        </div>

        {/* Right Panel */}

        <div className="lg:col-span-3 space-y-4">
          <SignatureDetails
            user={selectedUserData}
            hasSignature={
              !!signatures[selectedUser]
            }
          />

          <SignaturePreview
            user={selectedUserData}
            signature={
              signatures[selectedUser]
            }
          />

          <SignatureActions
            hasSignature={
              !!signatures[selectedUser]
            }
            drawMode={drawMode}
            onDrawToggle={() =>
              setDrawMode((prev) => !prev)
            }
            onRemove={
              handleRemoveSignature
            }
          />

          {drawMode && (
            <SignatureCanvas
              onSave={
                handleSaveSignature
              }
              onCancel={() =>
                setDrawMode(false)
              }
            />
          )}

          <SignatureStats
            users={signatories}
            signatures={signatures}
          />
        </div>
      </div>
    </div>
  );
}