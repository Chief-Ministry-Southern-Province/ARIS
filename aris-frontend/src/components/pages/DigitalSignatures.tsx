import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import SignatureDetails from "@/components/organisms/Signature/SignatureDetails";
import SignaturePreview from "@/components/organisms/Signature/SignaturePreview";
import SignatureActions from "@/components/organisms/Signature/SignatureActions";
import SignatureCanvas from "@/components/organisms/Signature/SignatureCanvas";
import { useProfile } from "@/hooks/useAuth";
import {useDeleteSignature,useSignatureImage,useSignatureStatus,useUploadSignature,} from "@/hooks/useSignatures";
import type { Signatory } from "@/types/signature.type";

const errorMessage = (error: unknown): string =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  ?? "Unable to update the signature. Please try again.";

const dataUrlToPngFile = async (dataUrl: string): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return new File([blob], "signature.png", { type: "image/png" });
};

export default function DigitalSignatures() {
  const { t } = useTranslation();

  const [drawMode, setDrawMode] = useState(false);
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: status, isLoading: isStatusLoading } = useSignatureStatus();
  const publicId = status?.data?.public_id;
  const { data: signatureImage } = useSignatureImage(publicId);
  const uploadMutation = useUploadSignature();
  const deleteMutation = useDeleteSignature();
  const [signatureUrl, setSignatureUrl] = useState<string>();

  const selectedOfficer = useMemo<Signatory | undefined>(() => {
    if (!profile) {
      return undefined;
    }

    return {
      id: String(profile.user.id),
      name: profile.user.name,
      role: profile.role.join(", "),
      avatar: profile.user.name.slice(0, 2).toUpperCase(),
    };
  }, [profile]);

  useEffect(() => {
    if (!signatureImage) {
      setSignatureUrl(undefined);

      return;
    }

    const url = URL.createObjectURL(signatureImage);
    setSignatureUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [signatureImage]);

  const uploadFile = async (file: File) => {
    if (file.type !== "image/png") {
      toast.error("Please select a PNG signature image.");

      return;
    }

    if (file.size > 512 * 1024) {
      toast.error("The signature image must not exceed 512 KB.");

      return;
    }

    try {
      await uploadMutation.mutateAsync(file);
      setDrawMode(false);
      toast.success("Signature saved successfully.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleSaveSignature = async (signature: string) => {
    try {
      await uploadFile(await dataUrlToPngFile(signature));
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const handleRemoveSignature = async () => {
    try {
      await deleteMutation.mutateAsync();
      toast.success("Signature removed successfully.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  if (isProfileLoading || isStatusLoading || !selectedOfficer) {
    return <div className="p-6 text-sm text-gray-500">Loading signature settings...</div>;
  }

  const hasSignature = status?.has_signature ?? false;
  const isSubmitting = uploadMutation.isPending || deleteMutation.isPending;

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
        
        <SignatureDetails
          user={selectedOfficer}
          hasSignature={hasSignature}
        />

        <SignaturePreview
          user={selectedOfficer}
          signature={signatureUrl}
        />

        <SignatureActions
          hasSignature={hasSignature}
          drawMode={drawMode}
          isSubmitting={isSubmitting}
          onDrawToggle={() => setDrawMode((prev) => !prev)}
          onUpload={uploadFile}
          onRemove={handleRemoveSignature}
        />

        {drawMode && (
          <SignatureCanvas
            onSave={handleSaveSignature}
            onCancel={() => setDrawMode(false)}
            isSaving={uploadMutation.isPending}
          />
        )}
      </div>
      
    </div>
  );
}
