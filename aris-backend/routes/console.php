<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Jobs\CreateBackupJob;
use App\Jobs\PruneExpiredBackupsJob;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function (): void {
    CreateBackupJob::dispatchAutomatic();
})->name('aris:automatic-backup')->dailyAt(config('backups.schedule.time'))->withoutOverlapping();

Schedule::job(new PruneExpiredBackupsJob)->dailyAt(config('backups.retention.cleanup_time'));
