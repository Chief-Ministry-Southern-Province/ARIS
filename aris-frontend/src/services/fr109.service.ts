import api from "./api";
import type { FR109Response, FR109Payload, FR109FormData } from "@/types/FR109.type";

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