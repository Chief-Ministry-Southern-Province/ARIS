<?php

namespace App\Jobs;

use App\Services\BackupService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;

class PruneExpiredBackupsJob implements ShouldQueue
{
    use Dispatchable, Queueable;
    public function handle(BackupService $service): void { $service->pruneExpired(); }
}
