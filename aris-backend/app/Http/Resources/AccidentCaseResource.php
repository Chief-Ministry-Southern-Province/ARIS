<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccidentCaseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,
            'case_number' => $this->case_number,
            'status' => $this->status,
            'current_stage' => $this->current_stage,
            'priority' => $this->priority,
            'created_at' => $this->created_at,
            'accident' => $this->whenLoaded('accident'),
            'creator' => $this->whenLoaded('creator'),
            'assignee' => $this->whenLoaded('assignee'),
            'institution' => $this->whenLoaded('institution'),

        ];
    }
}