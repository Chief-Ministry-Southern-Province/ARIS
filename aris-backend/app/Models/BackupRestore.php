<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BackupRestore extends Model
{
    protected $fillable = ['backup_id', 'requested_by', 'emergency_backup_id', 'status', 'message', 'started_at', 'completed_at'];

    protected $casts = ['started_at' => 'datetime', 'completed_at' => 'datetime'];

    public function backup(): BelongsTo { return $this->belongsTo(Backup::class); }
    public function requester(): BelongsTo { return $this->belongsTo(User::class, 'requested_by'); }
    public function emergencyBackup(): BelongsTo { return $this->belongsTo(Backup::class, 'emergency_backup_id'); }
}
