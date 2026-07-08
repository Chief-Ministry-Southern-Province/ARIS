<?php

namespace App\Models;

use App\Models\Traits\BelongsToInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Institution;
use App\Models\Vehicle;
use App\Models\User;

class Accident extends Model
{
    use HasFactory;
    use BelongsToInstitution;

    protected $fillable = [

        'reference_number',

        'institution_id',

        'reported_by',

        'vehicle_id',

        'driver_id',

        'accident_date',

        'accident_time',

        'severity',

        'province',

        'district',

        'location',

        'latitude',

        'longitude',

        'injury_count',

        'fatality_count',

        'road_condition',

        'weather_condition',

        'status',

        'description',

        'vehicle_damage',
    ];

    protected $casts = [

        'accident_date' => 'date',

        'accident_time' => 'datetime:H:i',

        'latitude' => 'decimal:7',

        'longitude' => 'decimal:7',
    ];

    public function institution()
    {
        return $this->belongsTo(Institution::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function reporter()
    {
        return $this->belongsTo(User::class, 'reported_by');
    }
}