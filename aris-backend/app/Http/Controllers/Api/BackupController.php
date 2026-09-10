<?php

namespace App\Http\Controllers\Api;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateBackupRequest;
use App\Http\Requests\RestoreBackupRequest;
use App\Http\Resources\BackupResource;
use App\Jobs\CreateBackupJob;
use App\Models\Backup;
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
        $backups = Backup::with('creator:id,name')->latest()
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

    public function show(Backup $backup)
    {
        $this->authorize('view', $backup);
        return new BackupResource($backup->load('creator:id,name'));
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

        abort(501, 'Automated backup restore is not configured for this environment.');
    }
}
