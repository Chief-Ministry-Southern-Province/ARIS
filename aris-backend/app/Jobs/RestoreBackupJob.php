<?php

namespace App\Jobs;

use App\Models\BackupRestore;
use App\Services\BackupRestoreService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class RestoreBackupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $timeout = 7200;
    public int $tries = 1;

    public function __construct(public BackupRestore $restore) {}

    public function handle(BackupRestoreService $service): void
    {
        $service->restore($this->restore);
    }
}
