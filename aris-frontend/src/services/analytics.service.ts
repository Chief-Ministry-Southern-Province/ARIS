import api from "@/services/api";
import type { AnalyticsContext } from "@/types/analytics.type";

export const getAnalyticsContext = async (period: string): Promise<AnalyticsContext> =>
  (await api.get("/analytics", { params: { period } })).data.data;
