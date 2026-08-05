import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { getDashboardStatistics } from "@/services/dashboard.service";

export const useDashboardStatistics = () =>
  useQuery({
    queryKey: queryKeys.dashboard.statistics,
    queryFn: getDashboardStatistics,
  });
