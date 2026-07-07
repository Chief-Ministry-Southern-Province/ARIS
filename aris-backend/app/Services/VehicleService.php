<?php

namespace App\Services;

use App\Models\Vehicle;
use App\Models\User;

class VehicleService
{
   public function createVehicle(array $data, User $user): Vehicle
    {
        return Vehicle::create($data);
    }

    public function updateVehicle(Vehicle $vehicle,array $data): Vehicle 
    {

        $vehicle->update($data);

        return $vehicle->fresh();
    }

    public function deleteVehicle(Vehicle $vehicle): bool
    {
        return (bool) $vehicle->delete();
    }
}
