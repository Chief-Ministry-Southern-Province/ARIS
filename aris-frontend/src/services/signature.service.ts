import api from "@/services/api";
import type { SignatureCaption } from "@/types/signature.type";

export interface SignatureStatus {
  has_signature: boolean;
  data: {
    public_id: string;
    created_at: string;
  } | null;
}

export interface UploadSignatureResponse {
  success: boolean;
  message: string;
  data: {
    public_id: string;
    is_active: boolean;
    created_at: string;
  };
}

export type { SignatureCaption } from "@/types/signature.type";

interface SignatureCaptionResponse {
  data: SignatureCaption;
}

export const getSignatureStatus = async (): Promise<SignatureStatus> => {
  const response = await api.get<SignatureStatus>("/user/signature/status");

  return response.data;
};

export const getSignatureImage = async (publicId: string): Promise<Blob> => {
  const response = await api.get(`/user/signature/${publicId}`, {
    responseType: "blob",
  });

  return response.data;
};

export const uploadSignature = async (signature: File): Promise<UploadSignatureResponse> => {
  const formData = new FormData();
  formData.append("signature", signature);

  const response = await api.post<UploadSignatureResponse>("/user/signature", formData);

  return response.data;
};

export const deleteSignature = async (): Promise<void> => {
  await api.delete("/user/signature");
};

export const getSignatureCaption = async (): Promise<SignatureCaption> => {
  const response = await api.get<SignatureCaptionResponse>("/user/signature/profile");

  return response.data.data;
};

export const updateSignatureCaption = async (caption: SignatureCaption): Promise<SignatureCaption> => {
  const response = await api.put<SignatureCaptionResponse>("/user/signature/profile", caption);

  return response.data.data;
};
