<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FR1044 extends Model
{
    protected $table = 'fr1044s';
    
    protected $fillable = [
        'accident_case_id',
        'reference_number',
        'created_by',
        'revision',
        'status',
        'data',
        'submitted_at',
        'approved_at',
    ];

    protected $casts = [

        'data' => 'array',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',

    ];

    public function accidentCase()
    {
        return $this->belongsTo(
            AccidentCase::class
        );
    }

    public function creator()
    {
        return $this->belongsTo(
            User::class,
            'created_by'
        );
    }
}
