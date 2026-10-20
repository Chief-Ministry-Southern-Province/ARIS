<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DelegationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'institution' => [
                'id' => $this->institution?->id,
                'name' => $this->institution?->name,
            ],
            'officer' => [
                'id' => $this->officer?->id,
                'name' => $this->officer?->name,
                'nic' => $this->officer?->nic,
                'role' => $this->officer?->roles->first()?->name,
            ],
            'acting_officer' => [
                'id' => $this->actingOfficer?->id,
                'name' => $this->actingOfficer?->name,
                'nic' => $this->actingOfficer?->nic,
                'role' => $this->actingOfficer?->roles->first()?->name,
            ],
            'role' => $this->role,
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'reason' => $this->reason,
            'notes' => $this->notes,
            'is_active' => (bool) $this->is_active,
            'is_currently_active' => $this->isCurrentlyActive(),
            'created_by' => [
                'id' => $this->creator?->id,
                'name' => $this->creator?->name,
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
