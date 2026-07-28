<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'message',
        'type',
        'action_url',
        'read',
        'read_at',
        'data',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'read' => 'boolean',
            'read_at' => 'datetime',
            'data' => 'array',
        ];
    }
}
