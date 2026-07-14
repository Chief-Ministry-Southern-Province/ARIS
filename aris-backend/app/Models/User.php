<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

use App\Models\Institution;
use App\Models\Vehicle;
use App\Models\Accident;
use App\Models\AccidentCase;
use App\Models\AccidentEvidence;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable,HasApiTokens,HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $fillable = [
        'name',
        'password',
        'nic',
        'mobile',
        'signature_path',
        'institution_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function vehicle()
    {
        return $this->hasOne(Vehicle::class, 'driver_id');
    }

    public function hasInstitution(): bool
    {
        return !is_null($this->institution_id);
    }

    public function isSystemAdmin(): bool
    {
        return $this->hasRole('system_admin');
    }

    public function reportedAccidents()
    {
        return $this->hasMany(Accident::class, 'reported_by');
    }

    public function driverAccidents()
    {
        return $this->hasMany(Accident::class,'driver_id');
    }

    public function uploadedEvidence()
    {
        return $this->hasMany(AccidentEvidence::class, 'uploaded_by');
    }

    public function createdAccidentCases()
    {
        return $this->hasMany(AccidentCase::class, 'created_by');
    }

    public function assignedAccidentCases()
    {
        return $this->hasMany(AccidentCase::class, 'assigned_to');
    }

    public function caseHistories()
    {
        return $this->hasMany(CaseHistory::class);
    }

    public function districts()
    {
        return $this->hasMany(SubjectOfficerDistrict::class);
    }
    
}
