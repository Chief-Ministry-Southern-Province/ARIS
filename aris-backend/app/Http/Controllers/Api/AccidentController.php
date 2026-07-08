<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\AccidentService;

use App\Http\Requests\Accident\StoreAccidentRequest;
use App\Http\Requests\Accident\UpdateAccidentRequest;
use App\Models\Accident;

class AccidentController extends Controller
{
    public function __construct(private AccidentService $accidentService) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->search;

        $accidents = Accident::query()

            ->with([
                'institution',
                'vehicle',
                'driver',
                'reporter',
            ])

            ->when($search, function ($query) use ($search) {

                $query->where(function ($q) use ($search) {

                    $q->where('reference_number', 'like', "%{$search}%")

                        ->orWhere('location', 'like', "%{$search}%")

                        ->orWhere('district', 'like', "%{$search}%")

                        ->orWhere('province', 'like', "%{$search}%");

                });

            })

            ->when($request->status, function ($query) use ($request) {

                $query->where('status', $request->status);

            })

            ->when($request->severity, function ($query) use ($request) {

                $query->where('severity', $request->severity);

            })

            ->latest()

            ->paginate(10);

        return response()->json($accidents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAccidentRequest $request)
    {
        $this->authorize('create', Accident::class);

        $accident = $this->accidentService->createAccident($request->validated(), auth()->user());

        return response()->json([
            'message' => 'Accident reported successfully.',
            'accident' => $accident->load(['institution', 'vehicle', 'driver', 'reporter']),
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Accident $accident)
    {
        $this->authorize('view', $accident);

        return response()->json(
            $accident->load(['institution', 'vehicle', 'driver', 'reporter'])
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAccidentRequest $request, Accident $accident)
    {
        $this->authorize('update', $accident);

        $this->accidentService->updateAccident($accident, $request->validated());

        return response()->json([
            'message' => 'Accident updated successfully.',
            'accident' => $accident->load(['institution', 'vehicle', 'driver', 'reporter']),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Accident $accident)
    {
        $this->authorize('delete', $accident);

        $this->accidentService->deleteAccident($accident);

        return response()->json(null, 204);
    }
}
