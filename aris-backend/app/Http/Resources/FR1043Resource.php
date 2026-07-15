<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FR1043Resource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [

            'id' => $this->id,

            'reference_number' => $this->reference_number,

            'revision' => $this->revision,

            'status' => $this->status,

            'submitted_at' => $this->submitted_at,

            'approved_at' => $this->approved_at,

            'data' => $this->data,

            'creator' => [

                'id' => $this->creator?->id,

                'name' => $this->creator?->name,

            ],

            'created_at' => $this->created_at,

            'updated_at' => $this->updated_at,

        ];
    }
}
