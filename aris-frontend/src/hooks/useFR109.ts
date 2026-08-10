import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { downloadFR109Pdf, getFR109, saveFR109, submitFR109, updateFR109WriteOff, updateFR109ChiefAccountingOrder, updateFR109ChiefSecretaryDecision } from "@/services/fr109.service";
import type { FR109FormData, FR109Response, WriteOffEntry } from "@/types/FR109.type";

const useGetFR109 = (caseId: string) => {
  const { data, isLoading, error } = useQuery<FR109Response, Error>({
    queryKey: queryKeys.fr109(Number(caseId)),
    queryFn: () => getFR109(caseId),
    enabled: !!caseId,
    retry: false,
  });

  return { data, isLoading, error };
};

const useSaveFR109 = (caseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<FR109Response, Error, FR109FormData>({
    mutationFn: (formData: FR109FormData) => saveFR109(caseId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fr109(Number(caseId)) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(Number(caseId)) });
    },
  });
};

const useSubmitFR109 = (caseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<FR109Response, Error, FR109FormData>({
    mutationFn: (formData: FR109FormData) => submitFR109(caseId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fr109(Number(caseId)) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(Number(caseId)) });
    },
  });
};

const useDownloadFR109Pdf = () =>
  useMutation<Blob, Error, number>({ mutationFn: downloadFR109Pdf });

const useUpdateFR109WriteOff = (caseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<FR109Response, Error, { fr109Id: number; writeOffEntries: WriteOffEntry[] }>({
    mutationFn: ({ fr109Id, writeOffEntries }) => updateFR109WriteOff(fr109Id, writeOffEntries),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fr109(Number(caseId)) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(Number(caseId)) });
    },
  });
};

const useUpdateFR109ChiefAccountingOrder = (caseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<FR109Response, Error, { fr109Id: number; stNo: string; refNo: string }>({
    mutationFn: ({ fr109Id, stNo, refNo }) => updateFR109ChiefAccountingOrder(fr109Id, stNo, refNo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fr109(Number(caseId)) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(Number(caseId)) });
    },
  });
};

const useUpdateFR109ChiefSecretaryDecision = (caseId: string) => {
  const queryClient = useQueryClient();
  return useMutation<FR109Response, Error, { fr109Id: number; secretaryToMinistryOf: string; refNo: string; writeOffStatus: "AUTHORISED" | "NOT_APPROVED" }>({
    mutationFn: ({ fr109Id, secretaryToMinistryOf, refNo, writeOffStatus }) => updateFR109ChiefSecretaryDecision(fr109Id, secretaryToMinistryOf, refNo, writeOffStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.fr109(Number(caseId)) });
      queryClient.invalidateQueries({ queryKey: queryKeys.timeline(Number(caseId)) });
    },
  });
};

export { useGetFR109, useSaveFR109, useSubmitFR109, useDownloadFR109Pdf, useUpdateFR109WriteOff, useUpdateFR109ChiefAccountingOrder, useUpdateFR109ChiefSecretaryDecision };
