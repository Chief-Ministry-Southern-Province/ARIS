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
    public function index()
    {
        $institutions = Institution::with('parentInstitution', 'childInstitutions')
            ->orderBy('name')
            ->get();

        return response()->json($institutions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInstitutionRequest $request)
    {
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
        $this->institutionManagementService->deleteInstitution($institution, request()->user());

        return response()->json(['message' => 'Institution deleted successfully']);
    }
}
