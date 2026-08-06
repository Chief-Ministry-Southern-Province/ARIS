import api from "@/services/api";
import type { DashboardStatistics } from "@/types/dashboard.type";

export const getDashboardStatistics = async (): Promise<DashboardStatistics> =>
  (await api.get("/dashboard/statistics")).data.data;
