<?php

namespace App\Http\Controllers\api;

use Illuminate\Http\Request;
use App\Services\AccidentTimelineService;
use App\Http\Resources\CaseHistoryResource;
use App\Http\Controllers\Controller;
use App\Models\AccidentCase;;

class CaseHistoryController extends Controller
{
    protected AccidentTimelineService $accidentTimelineService;

    public function __construct(AccidentTimelineService $accidentTimelineService)
    {
        $this->accidentTimelineService = $accidentTimelineService;
    }

    public function index(Request $request, AccidentCase $accidentCase)
    {
        $timeline = $this->accidentTimelineService->getTimelineForCase($accidentCase);

        return CaseHistoryResource::collection($timeline);
    }
}
