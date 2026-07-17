<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\FR1044\StoreFR1044Request;
use App\Http\Requests\FR1044\UpdateFR1044Request;
use App\Http\Requests\FR1044\StoreFR1044AttachmentRequest;
use App\Http\Resources\FR1044Resource;
use App\Http\Resources\EvidenceResource;
use App\Models\AccidentCase;
use App\Models\FR1044;
use App\Services\FR1044\FR1044Service;
use App\Services\EvidenceService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class FR1044Controller extends Controller
{
    public function __construct(
        protected FR1044Service $fr1044Service
    ) {}

    public function attachment(StoreFR1044AttachmentRequest $request, FR1044 $fr1044, EvidenceService $evidenceService): EvidenceResource
    {
        return new EvidenceResource($evidenceService->uploadForFR1044(
            $fr1044,
            $request->file('file'),
            $request->validated('field_key'),
            $request->validated('description'),
            $request->user(),
        ));
    }

    /**
     * Get latest revision.
     */
    public function show(AccidentCase $accidentCase)
    {
        $fr1044 = $this->fr1044Service
            ->getLatest($accidentCase);

        if (!$fr1044) {
            return response()->json([
                'message' => 'FR104(4) not found.'
            ], 404);
        }

        return new FR1044Resource($fr1044);
    }

    /**
     * Revision history.
     */
    public function history(AccidentCase $accidentCase)
    {
        return FR1044Resource::collection(
            $this->fr1044Service->getHistory($accidentCase)
        );
    }

    /**
     * Create draft.
     */
    public function store(StoreFR1044Request $request,AccidentCase $accidentCase) 
    {
        $fr1044 = $this->fr1044Service->createDraft(

            case: $accidentCase,

            user: $request->user(),

            data: $request->validated()['data']

        );

        return new FR1044Resource($fr1044);
    }

    /**
     * Update draft.
     */
    public function update(UpdateFR1044Request $request,FR1044 $fr1044) 
    {
        $fr1044 = $this->fr1044Service->updateDraft(

            fr1044: $fr1044,
            user: $request->user(),
            data: $request->validated()['data']

        );
        return new FR1044Resource($fr1044);
    }

    /**
     * Submit draft.
     */
    public function submit(Request $request, FR1044 $fr1044)
    {
        $fr1044 = $this->fr1044Service->submit($fr1044, $request->user());

        return new FR1044Resource($fr1044);
    }
}
