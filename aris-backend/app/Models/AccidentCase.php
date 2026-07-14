<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use App\Models\Accident;
use App\Models\Institution;
use App\Models\User;
use App\Models\CaseHistory;
use App\Models\Approval;
use App\Models\FR1043;

use App\Models\Traits\BelongsToInstitution;

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

    public function fr1043()
    {
        return $this->hasOne(FR1043::class);
    }

    public function latestFR1043()
    {
        return $this->hasOne(FR1043::class)
            ->latestOfMany('revision');
    }

    // public function fr1044()
    // {
    //     return $this->hasOne(FR1044::class);
    // }

    // public function fr109()
    // {
    //     return $this->hasOne(FR109::class);
    // }
}
