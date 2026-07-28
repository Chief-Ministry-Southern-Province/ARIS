<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AuditLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action,
            'module' => $this->module,
            'entity_type' => $this->entity_type ? class_basename($this->entity_type) : null,
            'entity_id' => $this->entity_id,
            'entity_public_id' => $this->entity_public_id,
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'description' => $this->description,
            'ip_address' => $this->ip_address,
            'method' => $this->method,
            'url' => $this->url,
            'created_at' => $this->created_at?->toISOString(),
            'user' => $this->whenLoaded('user', fn () => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'nic' => $this->user->nic,
            ] : null),
            'institution' => $this->whenLoaded('institution', fn () => $this->institution ? [
                'id' => $this->institution->id,
                'name' => $this->institution->name,
            ] : null),
        ];
    }
}
