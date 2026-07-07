<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use \App\Models\Scopes\InstitutionScope;

use App\Models\Vehicle;

class Institution extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'address',
        'contact_number',
        'district',
        'province',
        'head_of_institution',
        'parent_institution_id',
        'direct_to_rdhs'
    ];

    public function parentInstitution()
    {
        return $this->belongsTo(Institution::class, 'parent_institution_id');
    }

    public function childInstitutions()
    {
        return $this->hasMany(Institution::class, 'parent_institution_id');
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

}
