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

export const downloadEvidence = async (accidentId: number, evidenceId: number): Promise<Blob> => {
  const response = await api.get(`accidents/${accidentId}/evidence/${evidenceId}`, {
    responseType: "blob",
  });
  return response.data;
}
