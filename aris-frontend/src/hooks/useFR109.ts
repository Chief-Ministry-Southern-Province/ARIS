import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFR109, saveFR109, submitFR109 } from "@/services/fr109.service";
import type { FR109FormData, FR109Response } from "@/types/FR109.type";

const useGetFR109 = (caseId: string) => {
  const { data, isLoading, error } = useQuery<FR109Response, Error>({
    queryKey: ["fr109", caseId],
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
      queryClient.invalidateQueries({ queryKey: ["fr109", caseId] });
    },
  });
};

const useSubmitFR109 = (caseId: string) => {
  const queryClient = useQueryClient();

  return useMutation<FR109Response, Error, FR109FormData>({
    mutationFn: (formData: FR109FormData) => submitFR109(caseId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fr109", caseId] });
    },
  });
};

export { useGetFR109, useSaveFR109, useSubmitFR109 };