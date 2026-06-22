<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Institution;
use App\Http\Requests\Institution\StoreInstitutionRequest;
use App\Http\Requests\Institution\UpdateInstitutionRequest;

class InstitutionController extends Controller
{
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
        $validatedData = $request->validated();

        $institution = Institution::create($validatedData);

        return response()->json([
            'message' => 'Institution created successfully',
            'institution' => $institution
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $institution = Institution::with([
            'parentInstitution', 
            'childInstitutions'
            ])->find($id);

        if (!$institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }

        return response()->json($institution);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInstitutionRequest $request, string $id)
    {
        $institution = Institution::find($id);

        if (!$institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }

        $validatedData = $request->validated();

        $institution->update($validatedData);

        return response()->json([
            'message' => 'Institution updated successfully',
            'institution' => $institution
        ]);
        $institution->update($validatedData);

        return response()->json([
            'message' => 'Institution updated successfully',
            'institution' => $institution
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $institution = Institution::find($id);

        if (!$institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }

        $institution->delete();

        return response()->json(['message' => 'Institution deleted successfully']);
    }
}
