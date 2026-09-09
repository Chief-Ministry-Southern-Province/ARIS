export type BackupStatus = "pending" | "running" | "completed" | "failed";
export type BackupType = "manual" | "automatic";

export interface Backup {
  id: number; backup_code: string; type: BackupType; status: BackupStatus;
  file_name: string | null; file_size: number | null; started_at: string | null;
  completed_at: string | null; created_at: string; error_message?: string | null;
  permissions: { download: boolean; delete: boolean; restore: boolean };
}
export interface BackupFilters { page: number; from?: string; to?: string; type?: BackupType | ""; status?: BackupStatus | ""; }
export interface BackupPage { data: Backup[]; meta: { current_page: number; last_page: number; total: number; }; }
export interface BackupStatusSummary { last_successful_backup: Backup | null; next_scheduled_backup: string; status: "healthy" | "attention"; total_backups: number; }
