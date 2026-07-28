import api from "@/services/api";
import type { AuditLogFilters, AuditLogPage } from "@/types/audit-log.type";

export const auditLogService = {
  async list(filters: AuditLogFilters): Promise<AuditLogPage> {
    const { data } = await api.get<AuditLogPage>("/audit-logs", { params: filters });
    return data;
  },
};
