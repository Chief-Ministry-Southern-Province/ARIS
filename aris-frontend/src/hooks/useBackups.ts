import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { backupService } from "@/services/backup.service";
import type { BackupFilters } from "@/types/backup.type";

const keys = { all: ["backups"] as const, list: (filters: BackupFilters) => ["backups", "list", filters] as const, status: ["backups", "status"] as const };
export const useBackups = (filters: BackupFilters) => useQuery({ queryKey: keys.list(filters), queryFn: () => backupService.list(filters), refetchInterval: (query) => query.state.data?.data.some((b) => b.status === "pending" || b.status === "running") ? 5000 : false });
export const useBackupStatus = () => useQuery({ queryKey: keys.status, queryFn: backupService.status, refetchInterval: 30000 });
export const useCreateBackup = () => { const client = useQueryClient(); return useMutation({ mutationFn: backupService.create, onSuccess: () => client.invalidateQueries({ queryKey: keys.all }) }); };
export const useDeleteBackup = () => { const client = useQueryClient(); return useMutation({ mutationFn: backupService.remove, onSuccess: () => client.invalidateQueries({ queryKey: keys.all }) }); };
export const useRestoreBackup = () => { const client = useQueryClient(); return useMutation({ mutationFn: backupService.restore, onSuccess: () => client.invalidateQueries({ queryKey: keys.all }) }); };
