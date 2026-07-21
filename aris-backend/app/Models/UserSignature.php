<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSignature extends Model
{
    protected $fillable = [
        'public_id',
        'user_id',
        'disk',
        'path',
        'sha256',
        'captured_from_ip',
        'user_agent',
        'is_active',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'path' => 'encrypted',
            'captured_from_ip' => 'encrypted',
            'user_agent' => 'encrypted',
            'is_active' => 'boolean',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function approvals()
    {
        return $this->hasMany(Approval::class, 'user_signature_id');
    }
}
