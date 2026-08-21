import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/hooks/queryKeys";
import { getAnalyticsContext } from "@/services/analytics.service";

export const useAnalytics = (period: string) =>
  useQuery({
    queryKey: queryKeys.analytics.context(period),
    queryFn: () => getAnalyticsContext(period),
  });
