import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { approve, getApprovalHistory, getPendingApprovals, reject } from "@/services/approval.service";

export const usePendingApprovals = (page: number, search: string) => useQuery({ queryKey: ["approvals", "pending", page, search], queryFn: () => getPendingApprovals(page, search) });

export const useApprovalHistory = (caseId: number) => useQuery({ queryKey: ["approvals", "history", caseId], queryFn: () => getApprovalHistory(caseId), enabled: caseId > 0 });

const invalidate = (queryClient: ReturnType<typeof useQueryClient>, caseId?: number) => {
  queryClient.invalidateQueries({ queryKey: ["approvals"] });
  queryClient.invalidateQueries({ queryKey: ["timeline"] });
  if (caseId) queryClient.invalidateQueries({ queryKey: ["fr1043", caseId] });
};

export const useApprove = (caseId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: approve, onSuccess: () => invalidate(queryClient, caseId) });
};
export const useReject = (caseId?: number) => {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: reject, onSuccess: () => invalidate(queryClient, caseId) });
};
