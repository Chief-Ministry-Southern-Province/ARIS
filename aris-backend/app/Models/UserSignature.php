<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;


class UserSignature extends Model
{
    protected $fillable = [
        'public_id',
        'user_id',
        'disk',
        'path',
        'is_active',
    ];

   public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
