import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteSignature,
  getSignatureImage,
  getSignatureStatus,
  uploadSignature,
} from "@/services/signature.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useSignatureStatus = () => useQuery({
  queryKey: queryKeys.signatures.status,
  queryFn: getSignatureStatus,
  retry: false,
});

export const useSignatureImage = (publicId?: string) => useQuery({
  queryKey: queryKeys.signatures.image(publicId ?? ""),
  queryFn: () => getSignatureImage(publicId as string),
  enabled: Boolean(publicId),
  retry: false,
});

export const useUploadSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadSignature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.signatures.all });
    },
  });
};

export const useDeleteSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSignature,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.signatures.imageRoot });
      queryClient.invalidateQueries({ queryKey: queryKeys.signatures.status });
    },
  });
};
