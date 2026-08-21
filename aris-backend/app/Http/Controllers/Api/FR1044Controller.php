<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\FR1044\StoreFR1044Request;
use App\Http\Requests\FR1044\UpdateFR1044Request;
use App\Http\Requests\FR1044\StoreFR1044AttachmentRequest;
use App\Http\Resources\FR1044Resource;
use App\Http\Resources\EvidenceResource;
use App\Models\AccidentCase;
use App\Models\FR1044;
use App\Models\AccidentEvidence;
use App\Services\FR1044\FR1044Service;
use App\Services\EvidenceService;
use App\Services\PDF\FR1044PdfGenerator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class FR1044Controller extends Controller
{
    public function __construct(
        protected FR1044Service $fr1044Service,
        protected FR1044PdfGenerator $pdfGenerator,
    ) {}

    public function attachment(StoreFR1044AttachmentRequest $request, FR1044 $fr1044, EvidenceService $evidenceService): EvidenceResource
    {
        $this->authorize('attach', $fr1044);

        return new EvidenceResource($evidenceService->uploadForFR1044(
            $fr1044,
            $request->file('file'),
            $request->validated('field_key'),
            $request->validated('description'),
            $request->user(),
        ));
    }

    /** Resolve the uploaded file assigned to an FR1044 attachment field. */
    public function attachmentPreview(FR1044 $fr1044, string $fieldKey): EvidenceResource
    {
        $this->authorize('view', $fr1044);

        return new EvidenceResource($this->attachmentForField($fr1044, $fieldKey));
    }

    /** Download the uploaded file assigned to an FR1044 attachment field. */
    public function attachmentDownload(FR1044 $fr1044, string $fieldKey, EvidenceService $evidenceService)
    {
        $this->authorize('view', $fr1044);

        return $evidenceService->download(
            $this->attachmentForField($fr1044, $fieldKey),
            $fr1044->accidentCase->accident,
        );
    }

    private function attachmentForField(FR1044 $fr1044, string $fieldKey): AccidentEvidence
    {
        abort_unless(in_array($fieldKey, ['policeReportFile', 'courtOrderFile', 'boardReportFile'], true), 404);

        $evidenceKey = match ($fieldKey) {
            'policeReportFile' => 'policeReportEvidenceId',
            'courtOrderFile' => 'courtOrderEvidenceId',
            'boardReportFile' => 'boardReportEvidenceId',
        };

        // Revisions retain the evidence ID from the earlier revision. Resolve that
        // explicit reference first, then fall back to a file uploaded to this revision.
        $evidenceId = data_get($fr1044->data, $evidenceKey);
        if ($evidenceId) {
            $referencedEvidence = AccidentEvidence::query()
                ->whereKey($evidenceId)
                ->where('accident_id', $fr1044->accidentCase->accident_id)
                ->where('document_type', 'FR1044')
                ->first();

            if ($referencedEvidence) {
                return $referencedEvidence;
            }
        }

        return AccidentEvidence::query()
            ->where('accident_id', $fr1044->accidentCase->accident_id)
            ->where('document_type', 'FR1044')
            ->where('field_key', $fieldKey)
            ->latest('id')
            ->firstOrFail();
    }

    /**
     * Get latest revision.
     */
    public function show(AccidentCase $accidentCase)
    {
        $this->authorize('viewForCase', [FR1044::class, $accidentCase]);

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
        $this->authorize('viewForCase', [FR1044::class, $accidentCase]);

        return FR1044Resource::collection(
            $this->fr1044Service->getHistory($accidentCase)
        );
    }

    /**
     * Create draft.
     */
    public function store(StoreFR1044Request $request,AccidentCase $accidentCase) 
    {
        $this->authorize('create', [FR1044::class, $accidentCase]);

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
        $this->authorize('update', $fr1044);

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
        $this->authorize('submit', $fr1044);

        $fr1044 = $this->fr1044Service->submit($fr1044, $request->user());

        return new FR1044Resource($fr1044);
    }

    /** Download a PDF representation of an FR1044 revision. */
    public function downloadPdf(FR1044 $fr1044)
    {
        $this->authorize('view', $fr1044);

        return $this->pdfGenerator->download($fr1044->id);
    }
}
