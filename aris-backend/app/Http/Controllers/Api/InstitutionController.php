<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Institution;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Http\Requests\Institution\UpdateInstitutionRequest;
use App\Services\InstitutionManagementService;

class InstitutionController extends Controller
{

    public function __construct(protected InstitutionManagementService $institutionManagementService){    
    }
       

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');

        $query = $this->institutionManagementService
            ->getVisibleInstitutions($request->user());

        $query->when($search, function ($query) use ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                ->orWhere('district', 'LIKE', "%{$search}%")
                ->orWhere('province', 'LIKE', "%{$search}%")
                ->orWhere('type', 'LIKE', "%{$search}%");
            });
        });

        $institutions = $query->paginate(10);

        return response()->json($institutions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstitutionRequest $request)
    {
        if (! $this->authorize('create', Institution::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $institution = $this->institutionManagementService->createInstitution($request->validated(), $request->user());

        return response()->json([
            'message' => 'Institution created successfully',
            'institution' => $institution
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Institution $institution)
    {
        if (! $this->authorize('view', $institution)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(
            $institution->load(
                'parentInstitution',
                'childInstitutions'
            )
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstitutionRequest $request, Institution $institution)
    {
        if (! $this->authorize('update', $institution)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validatedData = $request->validated();

        $institution = $this->institutionManagementService->updateInstitution($institution, $validatedData, $request->user());

        return response()->json([
            'message' => 'Institution updated successfully',
            'institution' => $institution
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Institution $institution)
    {
        if (! $this->authorize('delete', $institution)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->institutionManagementService->deleteInstitution($institution, request()->user());

        return response()->json(['message' => 'Institution deleted successfully']);
    }

    public function allowedTypes(InstitutionManagementService $service,Request $request) {
        return response()->json([
            'types' => $service->allowedInstitutionTypes($request->user())
        ]);
    }

    public function getParentInstitutions(Request $request, InstitutionManagementService $service) {
        if (! $this->authorize('viewAny', Institution::class)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $parentInstitutions = $service->getParentInstitutions($request->user());

        return response()->json($parentInstitutions);
    }
}
