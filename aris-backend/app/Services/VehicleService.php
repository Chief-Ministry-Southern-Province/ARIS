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
            $vehicle->syncDrivers($driverIds ?? ($activeDriverId ? [$activeDriverId] : []), $activeDriverId ? (int) $activeDriverId : null, $user->id);
        }

        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function updateVehicle(Vehicle $vehicle, array $data, ?User $user = null): Vehicle 
    {
        $hasDriverIds = array_key_exists('driver_ids', $data);
        $driverIds = Arr::pull($data, 'driver_ids');
        $hasActiveDriverId = array_key_exists('active_driver_id', $data);
        $activeDriverId = Arr::pull($data, 'active_driver_id', Arr::get($data, 'driver_id'));

        $vehicle->update($data);

        if ($hasDriverIds || $hasActiveDriverId) {
            $currentDrivers = $driverIds ?? $vehicle->drivers()->pluck('users.id')->toArray();
            $targetActive = $hasActiveDriverId ? ($activeDriverId ? (int) $activeDriverId : null) : (int) $vehicle->driver_id;
            $vehicle->syncDrivers($currentDrivers, $targetActive, $user?->id);
        }

        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function activateDriver(Vehicle $vehicle, ?int $driverId, ?User $user = null, ?string $notes = null): Vehicle
    {
        $vehicle->activateDriver($driverId, $user?->id, $notes);
        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function syncDrivers(Vehicle $vehicle, array $driverIds, ?int $activeDriverId = null, ?User $user = null): Vehicle
    {
        $vehicle->syncDrivers($driverIds, $activeDriverId, $user?->id);
        return $vehicle->fresh(['institution', 'driver', 'drivers']);
    }

    public function deleteVehicle(Vehicle $vehicle): bool
    {
        return (bool) $vehicle->delete();
    }
}
