import { useQuery } from "@tanstack/react-query";
import { getEvidence } from "@/services/evidence.service";
import { queryKeys } from "@/hooks/queryKeys";

export const useEvidence = (accidentId?: number) => useQuery({ queryKey: queryKeys.evidence(accidentId ?? 0), queryFn: () => getEvidence(accidentId as number), enabled: Boolean(accidentId && accidentId > 0) });
