<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Approval extends Model
{
    protected $fillable = [
        'accident_case_id',
        'document_type',
        'step',
        'institution_id',
        'revision',
        'approver_id',
        'user_signature_id',
        'status',
        'comments',
        'acted_at',
        'user_signature_id',
    ];

    protected function casts(): array
    {
        return [
            'acted_at' => 'datetime',
        ];
    }

    public function accidentCase()
    {
        return $this->belongsTo(AccidentCase::class);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class,'approver_id');
    }

    public function signature()
    {
        return $this->belongsTo(UserSignature::class, 'user_signature_id');
    }
}
