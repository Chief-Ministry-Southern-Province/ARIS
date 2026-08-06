<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Analytics\AnalyticsPeriodRequest;
use App\Models\AccidentCase;
use App\Services\AnalyticsService;

class AnalyticsController extends Controller
{
    public function __construct(private readonly AnalyticsService $analytics)
    {
    }

    public function index(AnalyticsPeriodRequest $request)
    {
        $this->authorize('viewAny', AccidentCase::class);

        return response()->json([
            'data' => $this->analytics->contextFor(
                $request->user(),
                $request->validated('period'),
            ),
        ]);
    }
}
