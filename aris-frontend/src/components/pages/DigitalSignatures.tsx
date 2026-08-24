import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import SignatureDetails from "@/components/organisms/Signature/SignatureDetails";
import SignaturePreview from "@/components/organisms/Signature/SignaturePreview";
import SignatureActions from "@/components/organisms/Signature/SignatureActions";
import SignatureCanvas from "@/components/organisms/Signature/SignatureCanvas";
import { useProfile } from "@/hooks/useAuth";
import {useDeleteSignature,useSignatureCaption,useSignatureImage,useSignatureStatus,useUpdateSignatureCaption,useUploadSignature,} from "@/hooks/useSignatures";
import type { SignatureCaption } from "@/services/signature.service";
import type { Signatory } from "@/types/signature.type";
import { swalConfirm } from "@/utils/swal";

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
  const { data: savedCaption, isLoading: isCaptionLoading } = useSignatureCaption();
  const publicId = status?.data?.public_id;
  const { data: signatureImage, isLoading: isSignatureImageLoading } = useSignatureImage(publicId);
  const uploadMutation = useUploadSignature();
  const deleteMutation = useDeleteSignature();
  const updateCaptionMutation = useUpdateSignatureCaption();
  const [signatureUrl, setSignatureUrl] = useState<string>();
  const [caption, setCaption] = useState<SignatureCaption>({
    display_name: "",
    designation: "",
    institution_name: "",
    institution_lines: [],
  });

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

  useEffect(() => {
    if (savedCaption) {
      setCaption({
        ...savedCaption,
        institution_lines: savedCaption.institution_lines,
      });
    }
  }, [savedCaption]);

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

  const updateCaption = (field: keyof SignatureCaption, value: string | string[]) => {
    setCaption((current) => ({ ...current, [field]: value }));
  };

  const handleSaveCaption = async () => {
    const confirmed = await swalConfirm(
      "Save signature details?",
      "These details will be used for future approvals and printed below your signature in PDF documents.",
    );

    if (!confirmed) {
      return;
    }

    try {
      await updateCaptionMutation.mutateAsync({
        ...caption,
        institution_lines: caption.institution_lines.filter((line) => line.trim()),
      });
      toast.success("Signature caption saved successfully.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  const addInstitutionLine = () => {
    setCaption((current) => current.institution_lines.length < 4
      ? { ...current, institution_lines: [...current.institution_lines, ""] }
      : current);
  };

  const updateInstitutionLine = (index: number, value: string) => {
    setCaption((current) => ({
      ...current,
      institution_lines: current.institution_lines.map((line, lineIndex) => lineIndex === index ? value : line),
    }));
  };

  const removeInstitutionLine = (index: number) => {
    setCaption((current) => ({
      ...current,
      institution_lines: current.institution_lines.filter((_, lineIndex) => lineIndex !== index),
    }));
  };

  if (isProfileLoading || isStatusLoading || isCaptionLoading || !selectedOfficer) {
    return <div className="p-6 text-sm text-gray-500">Loading signature settings...</div>;
  }

  const hasSignature = status?.has_signature ?? false;
  const isSubmitting = uploadMutation.isPending || deleteMutation.isPending;

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {t("digitalSignature.title")}
        </h1>

        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {t("digitalSignature.description")}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <SignatureDetails
            user={selectedOfficer}
            hasSignature={hasSignature}
          />

          <SignaturePreview
            user={selectedOfficer}
            signature={signatureUrl}
            caption={caption}
            isLoading={hasSignature && isSignatureImageLoading}
          />
        </div>

        <SignatureActions
          hasSignature={hasSignature}
          drawMode={drawMode}
          isSubmitting={isSubmitting}
          onDrawToggle={() => setDrawMode((prev) => !prev)}
          onUpload={uploadFile}
          onRemove={handleRemoveSignature}
        />

        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-xs dark:bg-slate-900 dark:border-slate-700">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Details printed below the signature</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-300">These details are saved with each future approval and will not change older PDFs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Name
              <input value={caption.display_name} onChange={(event) => updateCaption("display_name", event.target.value)} maxLength={100} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Designation / role
              <input value={caption.designation ?? ""} onChange={(event) => updateCaption("designation", event.target.value)} maxLength={150} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </label>
            <label className="text-sm font-medium text-gray-700 dark:text-slate-200">Institution
              <input value={caption.institution_name ?? ""} onChange={(event) => updateCaption("institution_name", event.target.value)} maxLength={150} className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white" />
            </label>
            <div className="md:col-span-2">
              {caption.institution_lines.map((line, index) => (
                <div key={index} className="mt-3 flex gap-2">
                  <input aria-label={`Institution line ${index + 2}`} value={line} onChange={(event) => updateInstitutionLine(index, event.target.value)} maxLength={100} placeholder="Additional institution line" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-400" />
                  <button type="button" onClick={() => removeInstitutionLine(index)} className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-800 dark:text-red-300">Remove</button>
                </div>
              ))}
              {caption.institution_lines.length < 4 && (
                <button type="button" onClick={addInstitutionLine} className="mt-3 rounded-lg border border-blue-300 px-3 py-2 text-sm font-medium text-blue-700 dark:border-blue-700 dark:text-blue-300">
                  + Add institution line
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button type="button" onClick={handleSaveCaption} disabled={updateCaptionMutation.isPending || !caption.display_name.trim()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
              {updateCaptionMutation.isPending ? "Saving..." : "Save signature details"}
            </button>
          </div>
        </section>

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
