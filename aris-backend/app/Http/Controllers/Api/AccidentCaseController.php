<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AccidentCase\UpdateAccidentCaseRequest;
use App\Http\Resources\AccidentCaseResource;
use App\Models\AccidentCase;
use App\Services\AccidentCaseService;

class AccidentCaseController extends Controller
{
    protected AccidentCaseService $accidentCaseService;
    
    public function __construct(AccidentCaseService $accidentCaseService)
    {
        $this->accidentCaseService = $accidentCaseService;
    }

    public function index()
    {
        $cases = AccidentCase::with([
            'accident',
            'creator',
            'assignee',
            'institution',
        ])->latest()->paginate(10);

        return AccidentCaseResource::collection($cases);
    }

    public function show(AccidentCase $accidentCase)
    {
        $accidentCase->load([
            'accident',
            'creator',
            'assignee',
            'institution',
        ]);

        return new AccidentCaseResource($accidentCase);
    }

    public function update(UpdateAccidentCaseRequest $request,AccidentCase $accidentCase) {
        $this->accidentCaseService->update($accidentCase, $request->validated());

        return new AccidentCaseResource($accidentCase);
    }
}