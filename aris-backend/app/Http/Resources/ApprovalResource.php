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
            'revision' => $this->revision,
            'step' => $this->step,
            'status' => $this->status,
            'comments' => $this->comments,
            'acted_at' => $this->acted_at,
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