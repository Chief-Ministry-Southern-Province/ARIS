<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\FR109;

class ApprovalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $referenceNumber = match ($this->document_type) {
            'FR1043' => FR1043::query()
                ->where('accident_case_id', $this->accident_case_id)
                ->where('revision', $this->revision)
                ->value('reference_number'),
            'FR1044' => FR1044::query()
                ->where('accident_case_id', $this->accident_case_id)
                ->where('revision', $this->revision)
                ->value('reference_number'),
            'FR109' => FR109::query()
                ->where('accident_case_id', $this->accident_case_id)
                ->where('revision', $this->revision)
                ->value('reference_number'),
            default => null,
        };

        return [
            'id' => $this->id,
            'document_type' => $this->document_type,
            'reference_number'=> $referenceNumber,
            'revision' => $this->revision,
            'step' => $this->step,
            'status' => $this->status,
            'comments' => $this->comments,
            'acted_at' => $this->acted_at,
            'case' => [
                'id' => $this->accidentCase?->id,
                'case_number' => $this->accidentCase?->case_number,
            ],
            'submitted_by' => [
                'id' => $this->accidentCase?->creator?->id,
                'name' => $this->accidentCase?->creator?->name,
            ],
            'institution' => [
                'id' => $this->institution?->id,
                'name' => $this->institution?->name,
            ],
            'approver' => [
                'id' => $this->approver?->id,
                'name' => $this->approver?->name,
                'role' => $this->approver?->roles->first()?->name,
            ],
            'acted_by' => $this->actedBy ? [
                'id' => $this->actedBy->id,
                'name' => $this->actedBy->name,
                'role' => $this->actedBy->roles->first()?->name,
            ] : null,
            'is_acting' => (bool) ($this->acted_by_id && $this->acted_by_id !== $this->approver_id),
            'delegation' => $this->delegation ? [
                'id' => $this->delegation->id,
                'reason' => $this->delegation->reason,
                'officer_name' => $this->delegation->officer?->name,
            ] : null,
            'reassigned_from' => $this->reassignedFrom ? [
                'id' => $this->reassignedFrom->id,
                'name' => $this->reassignedFrom->name,
            ] : null,
            'reassign_reason' => $this->reassign_reason,
            'signature' => $this->signature ? [
                'public_id' => $this->signature->public_id,
            ] : null,
            'signature_caption' => $this->signature_caption_snapshot,
        ];
    }
}
