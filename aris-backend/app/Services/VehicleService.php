<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Support\Arr;

class VehicleService
{
    public function createVehicle(array $data, User $user): Vehicle
    {
        $driverIds = Arr::pull($data, 'driver_ids');
        $activeDriverId = Arr::pull($data, 'active_driver_id', Arr::get($data, 'driver_id'));

        $vehicle = Vehicle::create($data);

        if (! empty($driverIds) || $activeDriverId) {
            $vehicle->syncDrivers($driverIds ?? ($activeDriverId ? [$activeDriverId] : []), $activeDriverId ? (int) $activeDriverId : null);
        }

        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function updateVehicle(Vehicle $vehicle, array $data): Vehicle 
    {
        $hasDriverIds = array_key_exists('driver_ids', $data);
        $driverIds = Arr::pull($data, 'driver_ids');
        $hasActiveDriverId = array_key_exists('active_driver_id', $data);
        $activeDriverId = Arr::pull($data, 'active_driver_id', Arr::get($data, 'driver_id'));

        $vehicle->update($data);

        if ($hasDriverIds || $hasActiveDriverId) {
            $currentDrivers = $driverIds ?? $vehicle->drivers()->pluck('users.id')->toArray();
            $targetActive = $hasActiveDriverId ? ($activeDriverId ? (int) $activeDriverId : null) : (int) $vehicle->driver_id;
            $vehicle->syncDrivers($currentDrivers, $targetActive);
        }

        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function activateDriver(Vehicle $vehicle, ?int $driverId): Vehicle
    {
        $vehicle->activateDriver($driverId);
        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function syncDrivers(Vehicle $vehicle, array $driverIds, ?int $activeDriverId = null): Vehicle
    {
        $vehicle->syncDrivers($driverIds, $activeDriverId);
        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function deleteVehicle(Vehicle $vehicle): bool
    {
        return (bool) $vehicle->delete();
    }
}
