<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Institution;

use App\Models\Traits\BelongsToInstitution;

class Vehicle extends Model
{
    use HasFactory;
    use BelongsToInstitution;

    protected $fillable = [
        'vehicle_number',
        'registered_date',
        'vehicle_type',
        'brand',
        'model',
        'manufactured_year',
        'engine_number',
        'chassis_number',
        'insurance_number',
        'insurance_expiry_date',
        'value',
        'registered_owner',
        'fuel_type',
        'status',
        'institution_id',
        'driver_id'
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
