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

        return $this->pdfService->download(
            'pdf.fr109',
            ['document' => $document],
            "FR109-{$document->reference_number}.pdf",
            $this->pdfOptions(),
        );
    }

    public function stream(int $documentId): Response
    {
        $document = $this->loadDocument($documentId);

        return $this->pdfService->stream(
            'pdf.fr109',
            ['document' => $document],
            "FR109-{$document->reference_number}.pdf",
            $this->pdfOptions(),
        );
    }

    private function loadDocument(int $documentId): FR109
    {
        return FR109::query()->with(['accidentCase', 'creator'])->findOrFail($documentId);
    }

    private function footerHtml(): string
    {
        return '<div style="border-top: 0.25mm solid #000; padding-top: 1mm; font-family: iskoolapota, sans-serif; font-size: 8pt;"><div style="width: 50%; float: left; font-weight: bold;">Southern Provincial Ministry of Health</div><div style="width: 50%; float: right; text-align: right;">Page {PAGENO}</div><div style="clear: both;"></div></div>';
    }

    /** @return array<string, mixed> */
    private function pdfOptions(): array
    {
        return [
            'footer' => $this->footerHtml(),
            'margin_bottom' => 12,
        ];
    }
}
