import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { uploadEvidence } from "@/services/evidence.service";

export const useEvidenceUploadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accidentId, files }: { accidentId: number; files: File[] }) =>
      uploadEvidence(accidentId, files),
    onSuccess: (_, { accidentId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.evidence(accidentId) });
    },
  });
};
