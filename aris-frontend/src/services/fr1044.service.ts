import api from "@/services/api";
import type { FR104_4FormData, FR1044Payload, FR1044Response } from "@/types/FR104_4_types";

export const getFR1044 = async (caseId: number): Promise<FR1044Response> =>
  (await api.get(`/cases/${caseId}/fr1044`)).data;

export const createFR1044 = async (caseId: number, data: FR104_4FormData): Promise<FR1044Response> =>
  (await api.post(`/cases/${caseId}/fr1044`, { status: "DRAFT", data })).data;

export const updateFR1044 = async (id: number, status: "DRAFT" | "CHANGES_REQUESTED", data: FR104_4FormData): Promise<FR1044Response> =>
  (await api.put(`/fr1044/${id}`, { status, data } satisfies FR1044Payload)).data;

export const submitFR1044 = async (id: number): Promise<FR1044Response> =>
  (await api.post(`/fr1044/${id}/submit`)).data;
