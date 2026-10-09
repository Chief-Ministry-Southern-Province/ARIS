<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CaseHistoryResource;
use App\Models\AccidentCase;
use App\Models\CaseHistory;
use App\Services\AccidentTimelineService;
use Illuminate\Http\Request;

class CaseHistoryController extends Controller
{
    protected AccidentTimelineService $accidentTimelineService;

    public function __construct(AccidentTimelineService $accidentTimelineService)
    {
        $this->accidentTimelineService = $accidentTimelineService;
    }

    public function index(Request $request, AccidentCase $accidentCase)
    {
        $this->authorize('viewForCase', [CaseHistory::class, $accidentCase]);

        $timeline = $this->accidentTimelineService->getTimelineForCase($accidentCase);

        return CaseHistoryResource::collection($timeline);
    }
}
