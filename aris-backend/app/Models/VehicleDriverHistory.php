<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleDriverHistory extends Model
{
    protected $fillable = [
        'vehicle_id',
        'driver_id',
        'performed_by',
        'action',
        'notes',
    ];

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
