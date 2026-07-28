export interface AuditLog {
  id: number;
  action: string;
  module: string;
  entity_type: string | null;
  entity_id: number | null;
  entity_public_id: string | null;
  description: string | null;
  ip_address: string | null;
  method: string | null;
  url: string | null;
  created_at: string;
  user: { id: number; name: string; nic: string | null } | null;
  institution: { id: number; name: string } | null;
}

export interface AuditLogFilters {
  page?: number;
  search?: string;
  module?: string;
  action?: string;
  from?: string;
  to?: string;
}

export interface AuditLogPage {
  data: AuditLog[];
  meta: { current_page: number; last_page: number; total: number };
}
