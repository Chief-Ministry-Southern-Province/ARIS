# ARIS Backup Management Deployment

## Install and configure

Run from `aris-backend` after deployment:

```bash
php artisan migrate --force
php artisan db:seed --class=RoleSeeder --force
php artisan optimize
```

Set `QUEUE_CONNECTION=database` (or the approved production queue) and configure the standard MySQL connection. For off-site storage, set `BACKUP_STORAGE_DISK=s3`, use a private S3 bucket, block public access, enable SSE-KMS, and set `AWS_*` plus `BACKUP_S3_KMS_KEY_ID` only in the server secret store. Never set these values in the React environment.

Required backup variables are listed in `aris-backend/.env.example`: `BACKUP_STORAGE_DISK`, `BACKUP_SCHEDULE_TIME`, retention values, and `BACKUP_MYSQLDUMP_BINARY`. The server needs `mysqldump`, the PHP Zip extension, write access to `storage/app/backup-tmp`, and a MySQL account with only the dump privileges required for ARIS.

## Linux scheduler and worker

Use the existing deployment process to keep one queue worker alive. A minimal cron entry is:

```cron
* * * * * cd /var/www/aris/aris-backend && php artisan schedule:run >> /dev/null 2>&1
```

The schedule dispatches the automatic backup at `BACKUP_SCHEDULE_TIME` (default `02:00`) and a queued retention cleanup at `BACKUP_CLEANUP_TIME` (default `03:00`). The worker must have a timeout higher than the configured backup job timeout (3600 seconds). Do not run backup work inside the web request.

## Operations

An administrator selects **Admin Panel → Backup → Create Backup**. The API returns `202` and the UI polls the history until the queued job marks it completed or failed. Completed backups can be downloaded only through the authorized Laravel endpoint; no bucket URL is shown to the browser.

Retention keeps every completed backup for the daily period, then one backup per ISO week through the weekly period, then one per month through the monthly period. Deletion of the archive and its database record is audited.

## Recovery testing

This implementation deliberately does not execute a destructive production restore. `BACKUP_RESTORE_ENABLED` is false by default and the endpoint remains unavailable until the organization approves an environment-specific runbook that creates and verifies an emergency backup, restores to an isolated target, validates database and uploaded files, and records the outcome. Test recovery on a disposable non-production environment before approving that runbook.
