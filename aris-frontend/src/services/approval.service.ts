import api from "@/services/api";
import type { Approval, ApprovalHistoryGroup, PaginatedApprovals } from "@/types/approval.type";
import type { FR1043Response } from "@/types/form_104_3_types";

export const getPendingApprovals = async (page: number, search: string): Promise<PaginatedApprovals> => (await api.get("/approvals/pending", { params: { page, search } })).data;

export const getApprovalHistory = async (caseId: number, documentType?: "FR1043" | "FR1044" | "FR109", revision?: number): Promise<ApprovalHistoryGroup[]> =>
  (await api.get(`/cases/${caseId}/approvals`, { params: { document_type: documentType, revision } })).data.data;

export const getApprovalDocument = async (approvalId: number): Promise<FR1043Response> =>
  (await api.get(`/approvals/${approvalId}/document`)).data;

export const approve = async ({ id, comments }: { id: number; comments?: string }) => (await api.post<{ data: Approval }>(`/approvals/${id}/approve`, { comments })).data.data;

export const reject = async ({ id, comments }: { id: number; comments: string }) => (await api.post<{ data: Approval }>(`/approvals/${id}/reject`, { comments })).data.data;
