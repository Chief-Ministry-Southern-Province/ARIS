<?php

namespace App\Services\PDF;

use App\Models\FR1044;
use App\Services\DocumentSignatureService;
use App\Services\PDF\Contracts\PdfGeneratorInterface;
use Symfony\Component\HttpFoundation\Response;

class FR1044PdfGenerator implements PdfGeneratorInterface
{
    public function __construct(
        protected DocumentSignatureService $documentSignatureService,
        protected PDFService $pdfService,
    ) {
    }

    public function download(int $documentId): Response
    {
        set_time_limit(120);

        $document = $this->loadDocument($documentId);

        return $this->pdfService->download(
            'pdf.fr1044',
            $this->buildViewData($document),
            "FR1044-{$document->reference_number}.pdf",
            ['footer' => $this->footerHtml()],
        );
    }

    public function stream(int $documentId): Response
    {
        set_time_limit(120);

        $document = $this->loadDocument($documentId);

        return $this->pdfService->stream(
            'pdf.fr1044',
            $this->buildViewData($document),
            "FR1044-{$document->reference_number}.pdf",
            ['footer' => $this->footerHtml()],
        );
    }

    protected function loadDocument(int $documentId): FR1044
    {
        return FR1044::query()
            ->with(['accidentCase', 'creator'])
            ->findOrFail($documentId);
    }

    protected function buildViewData(FR1044 $document): array
    {
        $signatures = $this->documentSignatureService->getDocumentSignatures(
            $document->accidentCase,
            'FR1044',
            $document->revision,
        );

        return [
            'document' => $document,
            'pdhsSignature' => $this->firstSignatureForRoles($signatures, ['provincial director']),
            'secretarySignature' => $this->firstSignatureForRoles($signatures, ['secretary']),
            'chiefSecretarySignature' => $this->firstSignatureForRoles($signatures, ['chief secretary']),
        ];
    }

    /** @param array<int, array<string, mixed>> $signatures */
    private function firstSignatureForRoles(array $signatures, array $roles): ?array
    {
        foreach ($signatures as $signature) {
            $signatureRole = strtolower(str_replace('_', ' ', trim((string) ($signature['role'] ?? ''))));

            if (in_array($signatureRole, $roles, true)) {
                return $signature;
            }
        }

        return null;
    }

    private function footerHtml(): string
    {
        return '<div style="border-top: 0.25mm solid #000; padding-top: 1mm; font-family: iskoolapota, sans-serif; font-size: 8pt;"><div style="width: 50%; float: left; font-weight: bold;">Southern Provincial Ministry of Health</div><div style="width: 50%; float: right; text-align: right;">Page {PAGENO}</div><div style="clear: both;"></div></div>';
    }
}
