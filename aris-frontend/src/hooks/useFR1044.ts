import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { createFR1044, downloadFR1044Pdf, getFR1044, submitFR1044, updateFR1044 } from "@/services/fr1044.service";
import { queryKeys } from "@/hooks/queryKeys";
import type { FR104_4FormData, FR1044Response, FR1044Status } from "@/types/FR104_4_types";

const queryKey = queryKeys.fr1044;

export const useGetFR1044 = (caseId?: number) => useQuery({
  queryKey: queryKey(caseId ?? 0), queryFn: () => getFR1044(caseId as number),
  enabled: Boolean(caseId && caseId > 0), retry: false,
});

export const useSaveFR1044 = (caseId: number) => {
  const queryClient = useQueryClient();
  const save = (form: FR1044Response) => {
    queryClient.setQueryData(queryKey(caseId), form);
    queryClient.invalidateQueries({ queryKey: queryKeys.timeline(caseId) });
  };
  const create = useMutation({ mutationFn: (data: FR104_4FormData) => createFR1044(caseId, data), onSuccess: save });
  const update = useMutation({ mutationFn: ({ id, status, data }: { id: number; status: "DRAFT" | "CHANGES_REQUESTED"; data: FR104_4FormData }) => updateFR1044(id, status, data), onSuccess: save });
  return {
    saveFR1044: (id: number | null, status: FR1044Status | null, data: FR104_4FormData) => id
      ? update.mutateAsync({ id, status: status === "CHANGES_REQUESTED" ? "CHANGES_REQUESTED" : "DRAFT", data })
      : create.mutateAsync(data),
    loading: create.isPending || update.isPending,
  };
};

export const useSubmitFR1044 = (caseId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitFR1044,
    onSuccess: (form) => {
      queryClient.setQueryData(queryKey(caseId), form);
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(caseId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.approvals.all });
      toast.success("FR104(4) form submitted successfully.");
    },
  });
};

export const useDownloadFR1044Pdf = () =>
  useMutation({
    mutationFn: downloadFR1044Pdf,
  });
