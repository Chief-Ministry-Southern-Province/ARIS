<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Institution;

use App\Models\Traits\BelongsToInstitution;

use App\Models\User;
use App\Models\Accident;

use Illuminate\Support\Facades\DB;

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

    public function activeDriver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function drivers()
    {
        return $this->belongsToMany(User::class, 'vehicle_drivers', 'vehicle_id', 'driver_id')
            ->withPivot('is_active')
            ->withTimestamps();
    }

    public function activateDriver(?int $driverId): void
    {
        DB::transaction(function () use ($driverId) {
            if ($driverId === null) {
                DB::table('vehicle_drivers')
                    ->where('vehicle_id', $this->id)
                    ->update(['is_active' => false, 'updated_at' => now()]);
                $this->update(['driver_id' => null]);
                return;
            }

            // A driver can only be active on ONE vehicle at a time.
            // Deactivate this driver from any other vehicle first.
            $otherVehicles = Vehicle::where('driver_id', $driverId)
                ->where('id', '!=', $this->id)
                ->get();

            foreach ($otherVehicles as $otherVehicle) {
                DB::table('vehicle_drivers')
                    ->where('vehicle_id', $otherVehicle->id)
                    ->where('driver_id', $driverId)
                    ->update(['is_active' => false, 'updated_at' => now()]);
                $otherVehicle->update(['driver_id' => null]);
            }

            $exists = DB::table('vehicle_drivers')
                ->where('vehicle_id', $this->id)
                ->where('driver_id', $driverId)
                ->exists();

            DB::table('vehicle_drivers')
                ->where('vehicle_id', $this->id)
                ->update(['is_active' => false, 'updated_at' => now()]);

            if ($exists) {
                DB::table('vehicle_drivers')
                    ->where('vehicle_id', $this->id)
                    ->where('driver_id', $driverId)
                    ->update(['is_active' => true, 'updated_at' => now()]);
            } else {
                DB::table('vehicle_drivers')->insert([
                    'vehicle_id' => $this->id,
                    'driver_id' => $driverId,
                    'is_active' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $this->update(['driver_id' => $driverId]);
        });
    }

    public function syncDrivers(array $driverIds, ?int $activeDriverId = null): void
    {
        DB::transaction(function () use ($driverIds, $activeDriverId) {
            $driverIds = array_unique(array_filter(array_map('intval', $driverIds)));

            if ($activeDriverId && ! in_array($activeDriverId, $driverIds, true)) {
                $driverIds[] = $activeDriverId;
            }

            if ($activeDriverId === null && $this->driver_id && in_array((int) $this->driver_id, $driverIds, true)) {
                $activeDriverId = (int) $this->driver_id;
            }

            $pivotData = [];
            foreach ($driverIds as $id) {
                $pivotData[$id] = [
                    'is_active' => ($activeDriverId && (int) $id === (int) $activeDriverId),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            $this->drivers()->sync($pivotData);

            if ($activeDriverId) {
                $this->activateDriver($activeDriverId);
            } else {
                $this->update(['driver_id' => null]);
            }
        });
    }

    public function accidents()
    {
        return $this->hasMany(Accident::class);
    }
}
