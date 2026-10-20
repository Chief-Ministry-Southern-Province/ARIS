import api from "./api";
import type {
  OfficerDelegation,
  CreateDelegationRequest,
  HandoverWorkloadRequest,
  HandoverWorkloadResponse,
} from "@/types/delegation.type";

export const getDelegations = async (params?: {
  institution_id?: number;
  active?: boolean;
}): Promise<OfficerDelegation[]> => {
  const response = await api.get<{ data: OfficerDelegation[] }>("/delegations", { params });
  return response.data.data;
};

export const createDelegation = async (
  data: CreateDelegationRequest
): Promise<OfficerDelegation> => {
  const response = await api.post<{ data: OfficerDelegation }>("/delegations", data);
  return response.data.data;
};

export const revokeDelegation = async (
  delegationId: number,
  reason?: string
): Promise<{ message: string; data: OfficerDelegation }> => {
  const response = await api.delete<{ message: string; data: OfficerDelegation }>(
    `/delegations/${delegationId}`,
    { data: { reason } }
  );
  return response.data;
};

export const handoverWorkload = async (
  userId: number,
  data: HandoverWorkloadRequest
): Promise<HandoverWorkloadResponse> => {
  const response = await api.post<HandoverWorkloadResponse>(
    `/users/${userId}/handover`,
    data
  );
  return response.data;
};

export const updateUserStatus = async (
  userId: number,
  isActive: boolean,
  reason?: string
): Promise<{ message: string; user: unknown }> => {
  const response = await api.put<{ message: string; user: unknown }>(
    `/users/${userId}/status`,
    {
      is_active: isActive,
      reason,
    }
  );
  return response.data;
};
