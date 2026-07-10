<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Evidence\StoreEvidenceRequest;
use App\Models\Accident;
use App\Models\AccidentEvidence;
use App\Services\EvidenceService;
use Illuminate\Http\JsonResponse;

class EvidenceController extends Controller
{
    public function __construct(
        protected EvidenceService $evidenceService
    ) {}

    /**
     * Upload evidence.
     */
    public function store(StoreEvidenceRequest $request,Accident $accident): JsonResponse {

        $this->authorize('create', AccidentEvidence::class);

        $evidence = $this->evidenceService->upload(

            $accident,

            $request->file('files'),

            $request->description,

            auth()->user()

        );

        return response()->json([

            'message' => 'Evidence uploaded successfully.',

            'data' => $evidence,

        ], 201);
    }

    /**
     * List evidence.
     */
    public function index(Accident $accident): JsonResponse {

        return response()->json(

            $this->evidenceService->list($accident)

        );
    }

    /**
     * Download evidence.
     */
    public function download(AccidentEvidence $evidence) {
        return $this->evidenceService->download($evidence);
    }

    /**
     * Delete evidence.
     */
    public function destroy(AccidentEvidence $evidence): JsonResponse {

        $this->authorize('delete', $evidence);

        $this->evidenceService->delete($evidence);

        return response()->json([

            'message' => 'Evidence deleted successfully.'

        ]);
    }
}