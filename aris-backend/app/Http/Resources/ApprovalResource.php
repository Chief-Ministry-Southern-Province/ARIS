<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApprovalResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'document_type' => $this->document_type,
            'reference_number'=> $this->reference_number,
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
        ];
    }
}
