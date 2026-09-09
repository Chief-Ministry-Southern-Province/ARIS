<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Models\Backup;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Symfony\Component\Process\Process;
use ZipArchive;

class BackupService
{
    public function __construct(private AuditLogService $auditLogs) {}

    public function createRecord(string $type, ?int $userId = null): Backup
    {
        $now = now();
        $backup = Backup::create([
            'backup_code' => sprintf('ARIS-%s-%s', $now->format('Ymd-Hi'), strtoupper(str()->random(4))),
            'type' => $type, 'status' => 'pending', 'disk' => config('backups.disk'), 'created_by' => $userId,
        ]);
        $this->auditLogs->log(AuditAction::BACKUP_CREATED, AuditModule::BACKUP, $backup, [], ['type' => $type], 'Backup queued.');
        return $backup;
    }

    public function run(Backup $backup): void
    {
        $backup->update(['status' => 'running', 'started_at' => now(), 'error_message' => null]);
        $this->auditLogs->log(AuditAction::BACKUP_STARTED, AuditModule::BACKUP, $backup, [], [], 'Backup processing started.');
        $temporaryDirectory = config('backups.temporary_directory');
        $archivePath = $temporaryDirectory.DIRECTORY_SEPARATOR.$backup->backup_code.'.zip';

        try {
            if (! class_exists(ZipArchive::class)) throw new RuntimeException('The PHP ZipArchive extension is required for backups.');
            if (! is_dir($temporaryDirectory) && ! mkdir($temporaryDirectory, 0700, true) && ! is_dir($temporaryDirectory)) throw new RuntimeException('Unable to create temporary backup directory.');

            $dumpPath = $temporaryDirectory.DIRECTORY_SEPARATOR.$backup->backup_code.'.sql';
            $this->dumpDatabase($dumpPath);
            $this->buildArchive($archivePath, $dumpPath);
            @unlink($dumpPath);

            if (! is_file($archivePath) || filesize($archivePath) < 1) throw new RuntimeException('Backup archive verification failed.');
            $checksum = hash_file('sha256', $archivePath);
            $storagePath = 'backups/'.now()->format('Y/m').'/'.$backup->backup_code.'.zip';
            $stream = fopen($archivePath, 'rb');
            if ($stream === false) throw new RuntimeException('Unable to read backup archive.');
            try {
                $stored = Storage::disk($backup->disk)->put($storagePath, $stream, $this->storageOptions($backup->disk));
            } finally { fclose($stream); }
            if (! $stored || ! Storage::disk($backup->disk)->exists($storagePath) || Storage::disk($backup->disk)->size($storagePath) < 1) throw new RuntimeException('Secure storage verification failed.');

            $backup->update(['status' => 'completed', 'file_path' => $storagePath, 'file_name' => basename($storagePath), 'file_size' => Storage::disk($backup->disk)->size($storagePath), 'checksum' => $checksum, 'completed_at' => now()]);
            $this->auditLogs->log(AuditAction::BACKUP_COMPLETED, AuditModule::BACKUP, $backup, [], ['file_size' => $backup->file_size], 'Backup verified and stored.');
        } catch (\Throwable $exception) {
            Log::error('Backup failed', ['backup_id' => $backup->id, 'exception' => $exception]);
            $backup->update(['status' => 'failed', 'completed_at' => now(), 'error_message' => 'Backup processing failed. Review protected server logs for details.']);
            $this->auditLogs->log(AuditAction::BACKUP_FAILED, AuditModule::BACKUP, $backup, [], [], 'Backup processing failed.');
        } finally {
            if (is_file($archivePath)) @unlink($archivePath);
        }
    }

    public function delete(Backup $backup): void
    {
        if ($backup->file_path && Storage::disk($backup->disk)->exists($backup->file_path)) Storage::disk($backup->disk)->delete($backup->file_path);
        $this->auditLogs->log(AuditAction::BACKUP_DELETED, AuditModule::BACKUP, $backup, [], ['backup_code' => $backup->backup_code], 'Backup deleted.');
        $backup->delete();
    }

    public function pruneExpired(): void
    {
        $now = Carbon::now();
        $dailyCutoff = $now->copy()->subDays(config('backups.retention.daily_days'));
        $weeklyCutoff = $now->copy()->subDays(config('backups.retention.weekly_days'));
        $monthlyCutoff = $now->copy()->subDays(config('backups.retention.monthly_days'));
        $weeksKept = [];
        $monthsKept = [];

        Backup::where('status', 'completed')->whereNotNull('completed_at')->latest('completed_at')->each(function (Backup $backup) use ($dailyCutoff, $weeklyCutoff, $monthlyCutoff, &$weeksKept, &$monthsKept): void {
            $completedAt = $backup->completed_at;
            if ($completedAt->gte($dailyCutoff)) return;
            if ($completedAt->gte($weeklyCutoff)) {
                $week = $completedAt->format('o-W');
                if (! isset($weeksKept[$week])) { $weeksKept[$week] = true; return; }
            } elseif ($completedAt->gte($monthlyCutoff)) {
                $month = $completedAt->format('Y-m');
                if (! isset($monthsKept[$month])) { $monthsKept[$month] = true; return; }
            }
            $this->delete($backup);
        });
    }

    private function dumpDatabase(string $destination): void
    {
        $connection = config('database.default');
        if (config("database.connections.{$connection}.driver") !== 'mysql') throw new RuntimeException('Only MySQL production backups are enabled.');
        $settings = config("database.connections.{$connection}");
        $process = new Process([
            config('backups.mysqldump_binary'), '--single-transaction', '--routines', '--events', '--host='.$settings['host'], '--port='.(string) $settings['port'], '--user='.$settings['username'], '--result-file='.$destination, $settings['database'],
        ], null, ['MYSQL_PWD' => $settings['password']], null, 1800);
        $process->run();
        if (! $process->isSuccessful() || ! is_file($destination) || filesize($destination) < 1) throw new RuntimeException('Database export failed.');
    }

    private function buildArchive(string $archivePath, string $dumpPath): void
    {
        $zip = new ZipArchive;
        if ($zip->open($archivePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) throw new RuntimeException('Unable to create backup archive.');
        try {
            $zip->addFile($dumpPath, 'database/aris.sql');
            foreach (config('backups.source_directories') as $source) {
                $disk = Storage::disk($source['disk']);
                foreach ($disk->allFiles($source['path']) as $path) {
                    $contents = $disk->get($path);
                    if ($contents === false || ! $zip->addFromString('uploads/'.$source['disk'].'/'.$path, $contents)) throw new RuntimeException('Unable to archive an uploaded file.');
                }
            }
        } finally { $zip->close(); }
    }

    private function storageOptions(string $disk): array
    {
        if ($disk !== 's3') return [];
        return array_filter(['ServerSideEncryption' => config('backups.s3.server_side_encryption'), 'SSEKMSKeyId' => config('backups.s3.kms_key_id')]);
    }
}
