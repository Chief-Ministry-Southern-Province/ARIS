<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\VehicleService;

use App\Http\Requests\Vehicle\StoreVehicleRequest;
use App\Http\Requests\Vehicle\UpdateVehicleRequest;
use App\Models\Vehicle;
use App\Models\Scopes\InstitutionScope;

class VehicleController extends Controller
{
    public function __construct(private VehicleService $vehicleService) {}
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $user = $request->user();

        $vehicleQuery = Vehicle::query()
            ->with([
                'institution',
                'driver',
                'drivers',
            ])
            ->withCount('accidents');

        // A driver may report only against a vehicle explicitly assigned to
        // their account. The direct assignment is authoritative, even when an
        // administrator assigned a vehicle from a different institution.
        if ($user->hasRole('driver')) {
            $vehicleQuery
                ->withoutGlobalScope(InstitutionScope::class)
                ->where('driver_id', $user->id);
        }

        $vehicles = $vehicleQuery
            // Search
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('vehicle_number', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
                });
            })

            ->latest()
            ->paginate(10);

        return response()->json($vehicles);
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
            $vehicle->load(['institution', 'driver', 'drivers', 'driverHistories.driver', 'driverHistories.performer'])
        );
    }

    /**
     * Display the driver activation history for the specified vehicle.
     */
    public function driverHistory(Vehicle $vehicle)
    {
        $this->authorize('view', $vehicle);

        $histories = $vehicle->driverHistories()
            ->with(['driver', 'performer'])
            ->get();

        return response()->json($histories);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVehicleRequest $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);

        $updatedVehicle = $this->vehicleService->updateVehicle($vehicle, $request->validated(), $request->user());

        return response()->json([
            'message' => 'Vehicle updated successfully.',
            'vehicle' => $updatedVehicle,
        ]);
    }

    public function activateDriver(Request $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);

        $request->validate([
            'driver_id' => 'nullable|exists:users,id',
            'notes' => 'nullable|string|max:255',
        ]);

        $driverId = $request->filled('driver_id') ? (int) $request->input('driver_id') : null;

        $updatedVehicle = $this->vehicleService->activateDriver($vehicle, $driverId, $request->user(), $request->input('notes'));

        return response()->json([
            'message' => $driverId ? 'Active driver updated successfully.' : 'Active driver unassigned successfully.',
            'vehicle' => $updatedVehicle,
        ]);
    }

    public function syncDrivers(Request $request, Vehicle $vehicle)
    {
        $this->authorize('update', $vehicle);

        $request->validate([
            'driver_ids' => 'required|array',
            'driver_ids.*' => 'integer|exists:users,id',
            'active_driver_id' => 'nullable|integer|exists:users,id',
        ]);

        $updatedVehicle = $this->vehicleService->syncDrivers(
            $vehicle,
            $request->input('driver_ids', []),
            $request->input('active_driver_id'),
            $request->user()
        );

        return response()->json([
            'message' => 'Vehicle drivers updated successfully.',
            'vehicle' => $updatedVehicle,
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
