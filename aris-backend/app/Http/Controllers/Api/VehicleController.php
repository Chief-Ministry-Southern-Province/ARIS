<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VehicleService;

use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Models\Vehicle;

class VehicleController extends Controller
{
    public function __construct(private VehicleService $vehicleService) {}
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $this->authorize('viewAny', Vehicle::class);

        return response()->json(
            Vehicle::with([ 'institution', 'driver' ])
                ->latest()
                ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVehicleRequest $request)
    {
        $this->authorize('create', Vehicle::class);

        $vehicle = $this->vehicleService->createVehicle($request->validated(), auth()->user());

        return response()->json([
            'message' => 'Vehicle created successfully.',
            'vehicle' => $vehicle,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vehicle $vehicle)
    {
        $this->authorize('view', $vehicle);

        return response()->json(
            $vehicle->load(['institution', 'driver'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);

        $this->vehicleService->updateVehicle($vehicle, $request->validated());

        return response()->json([
            'message' => 'Vehicle updated successfully.',
            'vehicle' => $vehicle,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $this->authorize('delete', $vehicle);

        $this->vehicleService->deleteVehicle($vehicle);

        return response()->json(null, 204);
    }
}
