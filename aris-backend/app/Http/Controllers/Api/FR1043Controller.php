<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\FR1043\StoreFR1043Request;
use App\Http\Requests\FR1043\UpdateFR1043Request;
use App\Http\Resources\FR1043Resource;
use App\Models\AccidentCase;
use App\Models\FR1043;
use App\Services\FR1043\FR1043Service;
use App\Services\PDF\FR1043PdfGenerator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FR1043Controller extends Controller
{
    public function __construct(
        protected FR1043Service $fr1043Service,
        protected FR1043PdfGenerator $pdfGenerator,
    ) {}

    /**
     * Get latest revision.
     */
    public function show(AccidentCase $accidentCase)
    {
        $fr1043 = $this->fr1043Service
            ->getLatest($accidentCase);

        if (!$fr1043) {
            return response()->json([
                'message' => 'FR104(3) not found.'
            ], 404);
        }

        return new FR1043Resource($fr1043);
    }

    /**
     * Revision history.
     */
    public function history(AccidentCase $accidentCase)
    {
        return FR1043Resource::collection(
            $this->fr1043Service->getHistory($accidentCase)
        );
    }

    /**
     * Create draft.
     */
    public function store(StoreFR1043Request $request,AccidentCase $accidentCase) 
    {
        $fr1043 = $this->fr1043Service->createDraft(

            case: $accidentCase,

            user: $request->user(),

            data: $request->validated()['data']

        );

        return new FR1043Resource($fr1043);
    }

    /**
     * Update draft.
     */
    public function update(UpdateFR1043Request $request,FR1043 $fr1043) 
    {
        $fr1043 = $this->fr1043Service->updateDraft(

            fr1043: $fr1043,
            user: $request->user(),
            data: $request->validated()['data']

        );
        return new FR1043Resource($fr1043);
    }

    /**
     * Submit draft.
     */
    public function submit(Request $request, FR1043 $fr1043)
    {
        $fr1043 = $this->fr1043Service->submit($fr1043, $request->user());

        return new FR1043Resource($fr1043);
    }

    /** Download a PDF representation of an FR1043 revision and its approvals. */
    public function downloadPdf(FR1043 $fr1043)
    {
        return $this->pdfGenerator->download($fr1043->id);
    }
}
