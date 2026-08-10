<?php

namespace App\Services\PDF;

use App\Models\FR109;
use App\Services\PDF\Contracts\PdfGeneratorInterface;
use Symfony\Component\HttpFoundation\Response;

class FR109PdfGenerator implements PdfGeneratorInterface
{
    public function __construct(protected PDFService $pdfService)
    {
    }

    public function download(int $documentId): Response
    {
        $document = $this->loadDocument($documentId);

        return $this->pdfService->download('pdf.fr109', ['document' => $document], "FR109-{$document->reference_number}.pdf");
    }

    public function stream(int $documentId): Response
    {
        $document = $this->loadDocument($documentId);

        return $this->pdfService->stream('pdf.fr109', ['document' => $document], "FR109-{$document->reference_number}.pdf");
    }

    private function loadDocument(int $documentId): FR109
    {
        return FR109::query()->with(['accidentCase', 'creator'])->findOrFail($documentId);
    }
}
