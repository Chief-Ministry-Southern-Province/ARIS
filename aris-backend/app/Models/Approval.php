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
        'approver_id',
        'status',
        'comments',
        'acted_at',
    ];

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
}