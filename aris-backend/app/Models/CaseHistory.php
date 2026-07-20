<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;;

class CaseHistory extends Model
{
    protected $fillable = [
        'accident_case_id',
        'user_id',
        'action',
        'description',
        'old_value',
        'new_value',
    ];

    protected $casts = [
        'old_value' => 'array',
        'new_value' => 'array',
    ];

    public function accidentCase()
    {
        return $this->belongsTo(AccidentCase::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
