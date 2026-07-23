<?php

namespace App\Services;

use App\Models\Approval;
use App\Models\AccidentCase;
use App\Services\Signature\SignatureStorageService;

final readonly class DocumentSignatureService
{
    public function __construct(
        private SignatureStorageService $storage,
    ) {}

    public function getDocumentSignatures(AccidentCase $case, string $documentType, int $revision): array
    {
        $approvals = Approval::query()
            ->where('accident_case_id', $case->id)
            ->where('document_type', $documentType)
            ->where('revision', $revision)
            ->where('status', 'APPROVED')
            ->with(['approver.roles', 'approver.institution', 'institution', 'signature'])
            ->get();

        $signatures = [];

        foreach ($approvals as $approval) {
            if ($approval->signature !== null) {
                $signatures[] = $this->transformApproval($approval);
            }
        }

        return $signatures;
    }

    private function transformApproval(Approval $approval): array
    {
        return [
            'approval_id' => $approval->id,
            'name' => $approval->approver?->name,
            'role' => str_replace('_', ' ', $approval->approver?->roles->pluck('name')->implode(', ')),
            'institution' => $approval->institution?->name ?? $approval->approver?->institution?->name,
            'comments' => $approval->comments,
            'signature_public_id' => $approval->signature?->public_id,
            'signature_data_uri' => sprintf(
                'data:image/png;base64,%s',
                base64_encode($this->storage->contents($approval->signature->path)),
            ),
            'approved_at' => $approval->acted_at?->format('Y-m-d H:i'),
        ];
    }
}
