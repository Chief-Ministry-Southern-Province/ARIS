import api from "./api";
import type { EvidenceResponse } from "../types/evidence.type";

export const getEvidence = async (
  accidentId: number
): Promise<EvidenceResponse[]> => {
  console.time("getEvidence");

  const response = await api.get(`accidents/${accidentId}/evidence`);

  console.timeEnd("getEvidence");

  return response.data;
};

/** Upload photos or documents for an existing accident. */
export const uploadEvidence = async (
  accidentId: number,
  files: File[],
  description?: string,
): Promise<EvidenceResponse[]> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files[]", file));

  if (description) {
    formData.append("description", description);
  }

  const response = await api.post(`accidents/${accidentId}/evidence`, formData);
  return response.data.data;
};

export const downloadEvidence = async (accidentId: number, evidenceId: number): Promise<Blob> => {
  const response = await api.get(`accidents/${accidentId}/evidence/${evidenceId}`, {
    responseType: "blob",
  });
  return response.data;
}
