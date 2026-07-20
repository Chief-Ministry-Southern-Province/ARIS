<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\AccidentCase\UpdateAccidentCaseRequest;
use App\Http\Resources\AccidentCaseResource;
use App\Models\AccidentCase;
use App\Services\AccidentCaseService;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccidentCaseController extends Controller
{
    protected AccidentCaseService $accidentCaseService;
    
    public function __construct(AccidentCaseService $accidentCaseService)
    {
        $this->accidentCaseService = $accidentCaseService;
    }

    public function index(Request $request)
    {
        $cases = $this->accidentCaseService->getAll($request->search);

        return AccidentCaseResource::collection($cases);
    }

    public function show(int $id)
    {
        $case = $this->accidentCaseService->findById($id);

        return new AccidentCaseResource($case);
    }

    public function update(UpdateAccidentCaseRequest $request,AccidentCase $accidentCase) {
        $this->accidentCaseService->update($accidentCase, $request->validated());

        return new AccidentCaseResource($accidentCase);
    }
}