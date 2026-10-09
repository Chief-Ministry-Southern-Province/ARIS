<?php

namespace App\Models;

use App\Models\Traits\BelongsToInstitution;
use Illuminate\Database\Eloquent\Model;

class AccidentCase extends Model
{
    use BelongsToInstitution;

    protected $fillable = [
        'case_number',
        'accident_id',
        'institution_id',
        'created_by',
        'assigned_to',
        'current_stage',
        'status',
        'priority',
        'closed_at',
    ];

    public function accident()
    {
        return $this->belongsTo(Accident::class);
    }

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function histories()
    {
        return $this->hasMany(CaseHistory::class)
            ->latest();
    }

    public function approvals()
    {
        return $this->hasMany(Approval::class);
    }

    public function fr1043s()
    {
        return $this->hasMany(FR1043::class, 'accident_case_id');
    }

    public function latestFR1043()
    {
        return $this->hasOne(FR1043::class, 'accident_case_id')
            ->ofMany('revision', 'max');
    }

    public function fr1044s()
    {
        return $this->hasMany(FR1044::class, 'accident_case_id');
    }

    public function latestFR1044()
    {
        return $this->hasOne(FR1044::class, 'accident_case_id')
            ->ofMany('revision', 'max');
    }

    public function fr109s()
    {
        return $this->hasMany(FR109::class, 'accident_case_id');
    }

    public function latestFR109()
    {
        return $this->hasOne(FR109::class, 'accident_case_id')
            ->ofMany('revision', 'max');
    }
}
