<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Models\Backup;
use App\Models\BackupRestore;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Symfony\Component\Process\Process;
use ZipArchive;

class BackupRestoreService
{
    public function __construct(private BackupService $backups, private AuditLogService $auditLogs) {}

    public function restore(BackupRestore $restore): void
    {
        $restore->loadMissing('backup');
        $backup = $restore->backup;
        $requestedBy = $restore->requested_by;
        $temporaryDirectory = config('backups.temporary_directory').DIRECTORY_SEPARATOR.'restore-'.$backup->id.'-'.str()->uuid();
        $archivePath = $temporaryDirectory.DIRECTORY_SEPARATOR.'backup.zip';
        $maintenanceEnabled = false;

        try {
            $restore->update(['status' => 'running', 'started_at' => now(), 'message' => 'Restore is in progress.']);
            $this->assertRestorable($backup);
            File::ensureDirectoryExists($temporaryDirectory, 0700, true);
            $this->copyAndVerifyArchive($backup, $archivePath);
            $this->validateArchive($archivePath);

            $emergencyBackup = $this->backups->createRecord('automatic', $requestedBy);
            if (! $this->backups->run($emergencyBackup)) throw new RuntimeException('Emergency backup failed; restore was not started.');
            $restore->update(['emergency_backup_id' => $emergencyBackup->id]);

            Artisan::call('down', ['--retry' => 60]);
            $maintenanceEnabled = true;
            $contentsDirectory = $temporaryDirectory.DIRECTORY_SEPARATOR.'contents';
            $this->extractArchive($archivePath, $contentsDirectory);
            $this->restoreFiles($contentsDirectory);
            $this->restoreDatabase($contentsDirectory.DIRECTORY_SEPARATOR.'database'.DIRECTORY_SEPARATOR.'aris.sql');
            // The SQL dump contains the selected backup while it was still running. Restore its verified metadata after importing the database.
            $this->preserveCompletedBackup($backup);
            $this->preserveCompletedBackup($emergencyBackup);
            DB::table('backup_restores')->updateOrInsert(
                ['id' => $restore->id],
                [
                    'backup_id' => $backup->id,
                    'requested_by' => $requestedBy,
                    'emergency_backup_id' => $emergencyBackup->id,
                    'status' => 'completed',
                    'message' => 'Backup restore completed successfully.',
                    'started_at' => $restore->started_at ?? now(),
                    'completed_at' => now(),
                    'created_at' => $restore->created_at ?? now(),
                    'updated_at' => now(),
                ],
            );
            $this->auditLogs->log(AuditAction::BACKUP_RESTORE_COMPLETED, AuditModule::BACKUP, $backup, [], ['emergency_backup' => $emergencyBackup->backup_code], 'Backup restore completed.');
        } catch (\Throwable $exception) {
            $restore->update(['status' => 'failed', 'completed_at' => now(), 'message' => 'Backup restore failed. Review the protected audit log for details.']);
            Log::critical('Backup restore failed', ['backup_id' => $backup->id, 'requested_by' => $requestedBy, 'exception' => $exception]);
            $this->auditLogs->log(AuditAction::BACKUP_RESTORE_FAILED, AuditModule::BACKUP, $backup, [], [], 'Backup restore failed; review protected server logs and emergency backup.');
            throw $exception;
        } finally {
            if ($maintenanceEnabled) Artisan::call('up');
            File::deleteDirectory($temporaryDirectory);
        }
    }

    private function assertRestorable(Backup $backup): void
    {
        if ($backup->status !== 'completed' || ! $backup->file_path || ! $backup->checksum || ! Storage::disk($backup->disk)->exists($backup->file_path)) throw new RuntimeException('The selected backup is not available for restoration.');
    }

    private function copyAndVerifyArchive(Backup $backup, string $destination): void
    {
        $source = Storage::disk($backup->disk)->readStream($backup->file_path);
        $target = fopen($destination, 'wb');
        if ($source === false || $target === false) throw new RuntimeException('Unable to prepare the backup archive for restoration.');
        $hash = hash_init('sha256');
        try {
            while (! feof($source)) {
                $chunk = fread($source, 8192);
                if ($chunk === false) throw new RuntimeException('Unable to read the backup archive.');
                hash_update($hash, $chunk);
                fwrite($target, $chunk);
            }
        } finally {
            fclose($source);
            fclose($target);
        }
        if (! hash_equals($backup->checksum, hash_final($hash))) throw new RuntimeException('Backup checksum verification failed.');
    }

    private function validateArchive(string $archivePath): void
    {
        $zip = new ZipArchive;
        if ($zip->open($archivePath) !== true) throw new RuntimeException('The backup archive cannot be opened.');
        try {
            $databaseFound = false;
            $manifest = null;
            for ($index = 0; $index < $zip->numFiles; $index++) {
                $name = $zip->getNameIndex($index);
                if ($name === 'database/aris.sql') $databaseFound = true;
                if ($name === 'backup-manifest.json') $manifest = json_decode($zip->getFromIndex($index), true);
                if (! $this->isAllowedArchivePath($name)) throw new RuntimeException('Backup archive contains an unsafe file path.');
            }
            if (! $databaseFound || ! is_array($manifest) || ($manifest['format_version'] ?? null) !== 1 || ($manifest['source_directories'] ?? null) !== config('backups.source_directories')) throw new RuntimeException('Backup archive is not compatible with the current safe restore format.');
        } finally {
            $zip->close();
        }
    }

    private function extractArchive(string $archivePath, string $destination): void
    {
        $zip = new ZipArchive;
        if ($zip->open($archivePath) !== true || ! $zip->extractTo($destination)) throw new RuntimeException('Backup archive extraction failed.');
        $zip->close();
    }

    private function restoreFiles(string $contentsDirectory): void
    {
        foreach (config('backups.source_directories') as $source) {
            $archiveDirectory = $contentsDirectory.DIRECTORY_SEPARATOR.'uploads'.DIRECTORY_SEPARATOR.$source['disk'].DIRECTORY_SEPARATOR.$source['path'];
            if (! is_dir($archiveDirectory)) throw new RuntimeException('Backup archive is missing a managed upload directory.');
            $disk = Storage::disk($source['disk']);
            $disk->deleteDirectory($source['path']);
            foreach (File::allFiles($archiveDirectory) as $file) {
                $relativePath = str_replace(DIRECTORY_SEPARATOR, '/', $file->getRelativePathname());
                $stream = fopen($file->getPathname(), 'rb');
                if ($stream === false || ! $disk->put($source['path'].'/'.$relativePath, $stream)) throw new RuntimeException('Unable to restore an uploaded file.');
                fclose($stream);
            }
        }
    }

    private function restoreDatabase(string $sqlPath): void
    {
        if (! is_file($sqlPath)) throw new RuntimeException('Database export is missing from the backup.');
        $connection = config('database.default');
        if (config("database.connections.{$connection}.driver") !== 'mysql') throw new RuntimeException('Only MySQL restores are enabled.');
        $settings = config("database.connections.{$connection}");
        $process = new Process([
            config('backups.mysql_binary'), '--host='.$settings['host'], '--port='.(string) $settings['port'], '--user='.$settings['username'], '--database='.$settings['database'], '--execute=source '.str_replace('\\', '/', $sqlPath),
        ], null, ['MYSQL_PWD' => $settings['password']], null, 3600);
        $process->run();
        if (! $process->isSuccessful()) throw new RuntimeException('Database restore failed.');
    }

    private function preserveCompletedBackup(Backup $backup): void
    {
        DB::table('backups')->updateOrInsert(
            ['id' => $backup->id],
            [
                'backup_code' => $backup->backup_code,
                'type' => $backup->type,
                'status' => 'completed',
                'disk' => $backup->disk,
                'file_path' => $backup->file_path,
                'file_name' => $backup->file_name,
                'file_size' => $backup->file_size,
                'checksum' => $backup->checksum,
                'started_at' => $backup->started_at,
                'completed_at' => $backup->completed_at,
                'created_by' => $backup->created_by,
                'error_message' => null,
                'created_at' => $backup->created_at,
                'updated_at' => now(),
            ],
        );
    }

    private function isAllowedArchivePath(string $path): bool
    {
        if (str_contains($path, '\\') || str_starts_with($path, '/') || str_contains($path, '../')) return false;
        if (in_array($path, ['database/', 'database/aris.sql', 'backup-manifest.json'], true)) return true;
        foreach (config('backups.source_directories') as $source) {
            $directory = 'uploads/'.$source['disk'].'/'.$source['path'];
            if ($path === $directory.'/' || str_starts_with($path, $directory.'/')) return true;
        }
        return false;
    }
}
