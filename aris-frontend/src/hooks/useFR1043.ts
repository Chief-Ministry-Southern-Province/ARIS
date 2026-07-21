import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createFR1043, downloadFR1043Pdf, getFR1043, submitFR1043, updateFR1043 } from "@/services/fr1043.service";
import type { FR1043FormData, FR1043Status } from "@/types/form_104_3_types";
import { queryKeys } from "@/hooks/queryKeys";

const queryKey = queryKeys.fr1043;

export const useGetFR1043 = (caseId?: number) =>
  useQuery({
    queryKey: queryKey(caseId ?? 0),
    queryFn: () => getFR1043(caseId as number),
    enabled: Boolean(caseId && caseId > 0),
    retry: false,
  });

export const useUpdateFR1043 = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status, data }: { id: number; status: "DRAFT" | "CHANGES_REQUESTED"; data: FR1043FormData }) =>
      updateFR1043(id, status, data),
    onSuccess: (form) => {
      queryClient.setQueryData(queryKey(caseId), form);
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(caseId) });
    },
  });
};

export const useSaveFR1043 = (caseId: number) => {
  const queryClient = useQueryClient();
  const update = useUpdateFR1043(caseId);

  const create = useMutation({
    mutationFn: (data: FR1043FormData) => createFR1043(caseId, data),
    onSuccess: (form) => {
      queryClient.setQueryData(queryKey(caseId), form);
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(caseId) });
    },
  });

  return {
    saveFR1043: (formId: number | null, status: FR1043Status | null, data: FR1043FormData) =>
      formId ? update.mutateAsync({ id: formId, status: status === "CHANGES_REQUESTED" ? "CHANGES_REQUESTED" : "DRAFT", data }) : create.mutateAsync(data),
    loading: create.isPending || update.isPending,
  };
};

export const useSubmitFR1043 = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitFR1043,
    onSuccess: (form) => {
      queryClient.setQueryData(queryKey(caseId), form);
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(caseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
      toast.success("FR104(3) form submitted successfully.");
    },
  });
};

export const useDownloadFR1043Pdf = () =>
  useMutation({
    mutationFn: downloadFR1043Pdf,
  });
