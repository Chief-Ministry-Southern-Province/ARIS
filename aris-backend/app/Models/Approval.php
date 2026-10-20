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
        'acted_by_id',
        'delegation_id',
        'reassigned_from_id',
        'reassign_reason',
        'user_signature_id',
        'signature_caption_snapshot',
        'status',
        'comments',
        'acted_at',
    ];

    protected function casts(): array
    {
        return [
            'acted_at' => 'datetime',
            'signature_caption_snapshot' => 'array',
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

    public function actedBy()
    {
        return $this->belongsTo(User::class, 'acted_by_id');
    }

    public function delegation()
    {
        return $this->belongsTo(OfficerDelegation::class, 'delegation_id');
    }

    public function reassignedFrom()
    {
        return $this->belongsTo(User::class, 'reassigned_from_id');
    }

    public function signature()
    {
        return $this->belongsTo(UserSignature::class, 'user_signature_id');
    }
}
