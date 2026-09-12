<?php

namespace App\Jobs;

use App\Models\Backup;
use App\Services\BackupService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateBackupJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public int $timeout = 3600;
    public int $tries = 1;
    public function __construct(public Backup $backup) {}
    public function handle(BackupService $service): void { $service->run($this->backup); }
    public static function dispatchAutomatic(): void
    {
        $backup = app(BackupService::class)->createRecord('automatic');
        self::dispatch($backup);
    }
}
