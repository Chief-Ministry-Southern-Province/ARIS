<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Backup extends Model
{
    use HasFactory;

    protected $fillable = ['backup_code', 'type', 'status', 'disk', 'file_path', 'file_name', 'file_size', 'checksum', 'started_at', 'completed_at', 'created_by', 'error_message'];

    protected $casts = ['started_at' => 'datetime', 'completed_at' => 'datetime', 'file_size' => 'integer'];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function restores(): HasMany
    {
        return $this->hasMany(BackupRestore::class);
    }

    public function latestRestore(): HasOne
    {
        return $this->hasOne(BackupRestore::class)->latestOfMany();
    }
}
