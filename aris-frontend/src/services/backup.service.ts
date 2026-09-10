import api from "@/services/api";
import type { Backup, BackupFilters, BackupPage, BackupRestore, BackupStatusSummary } from "@/types/backup.type";

export const backupService = {
  async list(filters: BackupFilters): Promise<BackupPage> { const { data } = await api.get<BackupPage>("/admin/backups", { params: filters }); return data; },
  async status(): Promise<BackupStatusSummary> { const { data } = await api.get<BackupStatusSummary>("/admin/backups/status"); return data; },
  async create(): Promise<Backup> { const { data } = await api.post<Backup>("/admin/backups"); return data; },
  async remove(id: number): Promise<void> { await api.delete(`/admin/backups/${id}`); },
  async restore(id: number): Promise<BackupRestore> {
    const { data } = await api.post<{ data: BackupRestore }>(`/admin/backups/${id}/restore`, { confirmation: "RESTORE" });
    return data.data;
  },
  async download(backup: Backup): Promise<void> {
    const { data } = await api.get(`/admin/backups/${backup.id}/download`, { responseType: "blob" });
    const url = URL.createObjectURL(data); const link = document.createElement("a");
    link.href = url; link.download = backup.file_name ?? `${backup.backup_code}.zip`; link.click(); URL.revokeObjectURL(url);
  },
};
