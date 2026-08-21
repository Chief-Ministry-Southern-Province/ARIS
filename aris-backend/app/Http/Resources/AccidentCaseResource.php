<?php

namespace App\Http\Resources;

use App\Models\FR1043;
use App\Models\FR1044;
use App\Models\FR109;
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
            'form_actions' => $this->when($request->user(), fn () => [
                'fr1043' => $this->formAction($request, FR1043::class),
                'fr1044' => $this->formAction($request, FR1044::class),
                'fr109' => $this->formAction($request, FR109::class),
            ]),

        ];
    }

    private function formAction(Request $request, string $documentClass): string
    {
        if ($request->user()->can('create', [$documentClass, $this->resource])) {
            return 'create';
        }

        return $request->user()->can('viewForCase', [$documentClass, $this->resource])
            ? 'view'
            : 'none';
    }
}
