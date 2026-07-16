import { useQuery } from "@tanstack/react-query";
import timelineService from "@/services/timeline.service";

export const useTimeline = (caseId: number | string) => {
  const numericCaseId = Number(caseId);
  const query = useQuery({
    queryKey: ["timeline", numericCaseId],
    queryFn: () => timelineService.getCaseTimeline(numericCaseId),
    enabled: Number.isInteger(numericCaseId) && numericCaseId > 0,
  });

  return {
    timeline: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : "",
  };
};
