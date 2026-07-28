import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/hooks/queryKeys";
import { auditLogService } from "@/services/audit-log.service";
import type { AuditLogFilters } from "@/types/audit-log.type";

export const useAuditLogs = (filters: AuditLogFilters) =>
  useQuery({
    queryKey: queryKeys.audit.list(filters),
    queryFn: () => auditLogService.list(filters),
  });
