import api from "./api";
import type { FR1043Response,FR1043Payload, FR1043FormData } from "@/types/form_104_3_types";

export const getFR1043 = async (caseId: number): Promise<FR1043Response> => {
  const response = await api.get(`/cases/${caseId}/fr1043`);
  return response.data;
};

export const createFR1043 = async (caseId: number,data: FR1043FormData): Promise<FR1043Response> => 
{
  const payload: FR1043Payload = { status: "DRAFT", data };
  const response = await api.post(`/cases/${caseId}/fr1043`, payload);

  return response.data;
};

export const updateFR1043 = async (id: number,status: "DRAFT" | "CHANGES_REQUESTED",data: FR1043FormData): Promise<FR1043Response> => 
{
  const payload: FR1043Payload = { status, data };
  const response = await api.put(`/fr1043/${id}`, payload);

  return response.data;
};

export const submitFR1043 = async (id: number): Promise<FR1043Response> => {
  const response = await api.post(`/fr1043/${id}/submit`);

  return response.data;
};
