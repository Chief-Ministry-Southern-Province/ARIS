<?php

namespace App\Services\PDF;

use App\Models\FR1043;
use App\Services\DocumentSignatureService;
use App\Services\PDF\Contracts\PdfGeneratorInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Symfony\Component\HttpFoundation\Response;

class FR1043PdfGenerator implements PdfGeneratorInterface
{
    public function __construct(
        protected DocumentSignatureService $documentSignatureService,
    ) {
    }

    public function download(int $documentId): Response
    {
        $document = $this->loadDocument($documentId);

        $pdf = Pdf::loadView(
            'pdf.fr1043',
            $this->buildViewData($document)
        );

        return $pdf->download(
            "FR1043-{$document->reference_number}.pdf"
        );
    }

    public function stream(int $documentId): Response
    {
        $document = $this->loadDocument($documentId);

        $pdf = Pdf::loadView(
            'pdf.fr1043',
            $this->buildViewData($document)
        );

        return $pdf->stream(
            "FR1043-{$document->reference_number}.pdf"
        );
    }

    protected function loadDocument(int $documentId): FR1043
    {
        return FR1043::query()
            ->with([
                'accidentCase',
                'creator',
            ])
            ->findOrFail($documentId);
    }

    protected function buildViewData(FR1043 $document): array
    {
        return [

            'document' => $document,

            'case' => $document->accidentCase,

            'signatures' => $this->documentSignatureService
                ->getDocumentSignatures(
                    $document->accidentCase,
                    'FR1043',
                    $document->revision
                ),

        ];
    }
}