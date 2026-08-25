<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSignatureProfile extends Model
{
    protected $fillable = [
        'display_name',
        'designation',
        'institution_name',
        'institution_lines',
    ];

    protected function casts(): array
    {
        return [
            'institution_lines' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
