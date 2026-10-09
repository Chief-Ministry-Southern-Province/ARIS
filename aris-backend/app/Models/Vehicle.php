<?php

namespace App\Models;

use App\Models\Traits\BelongsToInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use BelongsToInstitution;
    use HasFactory;

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
        'driver_id',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function accidents()
    {
        return $this->hasMany(Accident::class);
    }
}
