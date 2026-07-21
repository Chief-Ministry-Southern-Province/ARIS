<?php

namespace App\Services;

use App\Models\Approval;
use App\Models\AccidentCase;

class DocumentSignatureService
{
    public function getDocumentSignatures(AccidentCase $case, string $documentType, int $revision): array
    {
        $approvals = Approval::query()
            ->where('accident_case_id', $case->id)
            ->where('document_type', $documentType)
            ->where('revision', $revision)
            ->with(['approver.role', 'signature'])
            ->get();

        $signatures = [];

        foreach ($approvals as $approval) {
            if ($approval->signature) {
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
            'role' => $approval->approver?->role?->name,
            'signature_public_id' => $approval->signature?->public_id,
            'signature_disk' => $approval->signature?->disk,
            'signature_path' => $approval->signature?->path,
            'approved_at' => $approval->acted_at,
        ];
    }
}