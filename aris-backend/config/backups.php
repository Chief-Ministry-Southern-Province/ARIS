<?php

return [
    'disk' => env('BACKUP_STORAGE_DISK', 'private'),
    'temporary_directory' => storage_path('app/backup-tmp'),
    'schedule' => ['time' => env('BACKUP_SCHEDULE_TIME', '02:00')],
    'retention' => [
        'daily_days' => (int) env('BACKUP_RETENTION_DAILY_DAYS', 30),
        'weekly_days' => (int) env('BACKUP_RETENTION_WEEKLY_DAYS', 90),
        'monthly_days' => (int) env('BACKUP_RETENTION_MONTHLY_DAYS', 365),
        'cleanup_time' => env('BACKUP_CLEANUP_TIME', '03:00'),
    ],
    // Only application uploads are archived. Never add the backup disk itself here.
    'source_directories' => [
        ['disk' => 'public', 'path' => 'evidence'],
        ['disk' => 'private', 'path' => 'signatures'],
        ['disk' => 'private', 'path' => 'fr1044'],
    ],
    'mysqldump_binary' => env('BACKUP_MYSQLDUMP_BINARY', 'mysqldump'),
    's3' => [
        'server_side_encryption' => env('BACKUP_S3_SSE', 'aws:kms'),
        'kms_key_id' => env('BACKUP_S3_KMS_KEY_ID'),
    ],
    // A restore is intentionally unavailable until production runbooks and approval are in place.
    'restore_enabled' => (bool) env('BACKUP_RESTORE_ENABLED', false),
];
