import api from "@/services/api";
import type { Approval, PaginatedApprovals } from "@/types/approval.type";

export const getPendingApprovals = async (): Promise<PaginatedApprovals> => (await api.get("/approvals/pending")).data;

export const getApprovalHistory = async (caseId: number): Promise<Approval[]> => (await api.get(`/cases/${caseId}/approvals`, { params: { document_type: "FR1043" } })).data.data;

export const approve = async ({ id, comments }: { id: number; comments?: string }) => (await api.post<{ data: Approval }>(`/approvals/${id}/approve`, { comments })).data.data;

export const reject = async ({ id, comments }: { id: number; comments: string }) => (await api.post<{ data: Approval }>(`/approvals/${id}/reject`, { comments })).data.data;
