import api from "./api";
import type { FR109Response, FR109Payload, FR109FormData, WriteOffEntry } from "@/types/FR109.type";

export const downloadFR109Pdf = async (id: number): Promise<Blob> =>
  (await api.get(`/fr109/${id}/pdf`, { responseType: "blob" })).data;

export const getFR109 = async (caseId: string): Promise<FR109Response> => {
  const response = await api.get(`/cases/${caseId}/fr109`);
  return response.data;
};

export const saveFR109 = async (caseId: string, data: FR109FormData): Promise<FR109Response> => {
  const payload: FR109Payload = { status: "DRAFT", data };
  const response = await api.post(`/cases/${caseId}/fr109`, payload);

  return response.data;
};

export const submitFR109 = async (caseId: string, data: FR109FormData): Promise<FR109Response> => {
  const payload: FR109Payload = { status: "SUBMITTED", data };
  const response = await api.post(`/cases/${caseId}/fr109/submit`, payload);

  return response.data;
};

export const updateFR109WriteOff = async (fr109Id: number, writeOffEntries: WriteOffEntry[]): Promise<FR109Response> => {
  const response = await api.put(`/fr109/${fr109Id}/write-off`, { writeOffEntries });
  return response.data;
};

export const updateFR109ChiefAccountingOrder = async (
  fr109Id: number,
  chiefAccountingOfficerSTNo: string,
  chiefAccountingOfficerRefNo: string,
): Promise<FR109Response> => {
  const response = await api.put(`/fr109/${fr109Id}/chief-accounting-order`, {
    chiefAccountingOfficerSTNo,
    chiefAccountingOfficerRefNo,
  });
  return response.data;
};

export const updateFR109ChiefSecretaryDecision = async (
  fr109Id: number,
  secretaryToMinistryOf: string,
  refNo: string,
  writeOffStatus: "AUTHORISED" | "NOT_APPROVED",
): Promise<FR109Response> => {
  const response = await api.put(`/fr109/${fr109Id}/chief-secretary-decision`, { secretaryToMinistryOf, refNo, writeOffStatus });
  return response.data;
};
