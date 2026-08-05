<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccidentCase;
use App\Services\DashboardService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboard)
    {
    }

    public function statistics(Request $request)
    {
        $this->authorize('viewAny', AccidentCase::class);

        return response()->json([
            'data' => $this->dashboard->statisticsFor($request->user()),
        ]);
    }
}
