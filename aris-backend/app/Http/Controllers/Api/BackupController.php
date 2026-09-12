<?php

namespace App\Http\Controllers\Api;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBackupRequest;
use App\Http\Requests\RestoreBackupRequest;
use App\Http\Requests\UploadBackupRequest;
use App\Http\Resources\BackupResource;
use App\Jobs\CreateBackupJob;
use App\Jobs\RestoreBackupJob;
use App\Models\Backup;
use App\Models\BackupRestore;
use App\Services\AuditLogService;
use App\Services\BackupService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class BackupController extends Controller
{
    public function __construct(private BackupService $backups, private AuditLogService $auditLogs) {}

    public function index(Request $request)
    {
        $this->authorize('viewAny', Backup::class);
        $filters = $request->validate([
            'from' => ['nullable', 'date'], 'to' => ['nullable', 'date', 'after_or_equal:from'],
            'type' => ['nullable', Rule::in(['manual', 'automatic'])], 'status' => ['nullable', Rule::in(['pending', 'running', 'completed', 'failed'])],
        ]);
        $backups = Backup::with(['creator:id,name', 'latestRestore'])->latest()
            ->when($filters['from'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '>=', $date))
            ->when($filters['to'] ?? null, fn ($q, $date) => $q->whereDate('created_at', '<=', $date))
            ->when($filters['type'] ?? null, fn ($q, $type) => $q->where('type', $type))
            ->when($filters['status'] ?? null, fn ($q, $status) => $q->where('status', $status))
            ->paginate(15)->withQueryString();
        return BackupResource::collection($backups);
    }

    public function store(CreateBackupRequest $request)
    {
        $backup = $this->backups->createRecord('manual', $request->user()->id);
        CreateBackupJob::dispatch($backup);
        return (new BackupResource($backup))->response()->setStatusCode(202);
    }

    public function upload(UploadBackupRequest $request)
    {
        if (! config('backups.restore_enabled')) {
            return response()->json(['message' => 'Backup upload is not available until approved recovery procedures are configured.'], 409);
        }

        $file = $request->file('backup');
        $now = now();
        $backup = Backup::create([
            'backup_code' => sprintf('ARIS-UPLOAD-%s-%s', $now->format('Ymd-Hi'), strtoupper(str()->random(4))),
            'type' => 'manual',
            'status' => 'pending',
            'disk' => config('backups.disk'),
            'created_by' => $request->user()->id,
        ]);
        $storagePath = 'backups/imported/'.$now->format('Y/m').'/'.$backup->backup_code.'.zip';

        try {
            $storedPath = Storage::disk($backup->disk)->putFileAs(dirname($storagePath), $file, basename($storagePath));
            if (! $storedPath || ! Storage::disk($backup->disk)->exists($storagePath)) {
                throw new \RuntimeException('Unable to store the uploaded backup archive.');
            }

            $backup->update([
                'status' => 'completed',
                'file_path' => $storagePath,
                'file_name' => basename($file->getClientOriginalName()),
                'file_size' => Storage::disk($backup->disk)->size($storagePath),
                'checksum' => hash_file('sha256', $file->getRealPath()),
                'started_at' => $now,
                'completed_at' => now(),
            ]);
        } catch (\Throwable $exception) {
            Storage::disk($backup->disk)->delete($storagePath);
            $backup->update(['status' => 'failed', 'completed_at' => now(), 'error_message' => 'Uploaded backup could not be stored.']);
            throw $exception;
        }

        $this->auditLogs->log(AuditAction::UPLOAD, AuditModule::BACKUP, $backup, [], ['file_name' => $backup->file_name, 'file_size' => $backup->file_size], 'Backup ZIP uploaded for recovery.', $request);

        return (new BackupResource($backup))->response()->setStatusCode(201);
    }

    public function show(Backup $backup)
    {
        $this->authorize('view', $backup);
        return new BackupResource($backup->load(['creator:id,name', 'latestRestore']));
    }

    public function status(Request $request)
    {
        $this->authorize('viewAny', Backup::class);
        $last = Backup::where('status', 'completed')->latest('completed_at')->first();
        $nextScheduledBackup = now()->setTimeFromTimeString(config('backups.schedule.time'));
        if ($nextScheduledBackup->isPast()) {
            $nextScheduledBackup->addDay();
        }
        return response()->json([
            'last_successful_backup' => $last ? new BackupResource($last) : null,
            'next_scheduled_backup' => $nextScheduledBackup->toIso8601String(),
            'status' => Backup::where('status', 'failed')->where('created_at', '>=', now()->subDay())->exists() ? 'attention' : 'healthy',
            'total_backups' => Backup::count(),
        ]);
    }

    public function download(Request $request, Backup $backup)
    {
        $this->authorize('download', $backup);
        abort_unless($backup->status === 'completed' && $backup->file_path && Storage::disk($backup->disk)->exists($backup->file_path), 404);
        $this->auditLogs->log(AuditAction::BACKUP_DOWNLOADED, AuditModule::BACKUP, $backup, [], [], 'Backup downloaded.', $request);
        return Storage::disk($backup->disk)->download($backup->file_path, $backup->file_name);
    }

    public function destroy(Backup $backup)
    {
        $this->authorize('delete', $backup);
        $this->backups->delete($backup);
        return response()->noContent();
    }

    public function restore(RestoreBackupRequest $request, Backup $backup)
    {
        // No destructive restore command is shipped without an approved, environment-specific recovery runbook.
        if (! config('backups.restore_enabled')) {
            return response()->json([
                'message' => 'Backup restore is not available until approved recovery procedures are configured.',
            ], 409);
        }

        abort_unless($backup->status === 'completed' && $backup->file_path && $backup->checksum, 422, 'The selected backup is incomplete.');

        $restore = BackupRestore::create(['backup_id' => $backup->id, 'requested_by' => $request->user()->id, 'status' => 'pending', 'message' => 'Backup restore has been queued.']);
        $this->auditLogs->log(AuditAction::BACKUP_RESTORE_STARTED, AuditModule::BACKUP, $backup, [], ['restore_id' => $restore->id], 'Backup restore queued.', $request);
        RestoreBackupJob::dispatch($restore);

        return response()->json([
            'data' => $restore,
            'message' => 'Backup restore has been queued. The system will be temporarily unavailable while recovery is in progress.',
        ], 202);
    }
}
