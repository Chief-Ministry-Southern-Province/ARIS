<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EvidenceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'accident_reference_number' => $this->accident?->reference_number,
            'original_name' => $this->original_name,
            'file_name' => $this->file_name,
            'file_url' => Storage::disk('public')->url($this->file_path),
            'mime_type' => $this->mime_type,
            'file_size' => $this->file_size,
            'file_size_kb' => round($this->file_size / 1024, 2),
            'evidence_type' => $this->evidence_type,
            'description' => $this->description,

            'uploaded_by' => [
                'id' => $this->uploader?->id,
                'name' => $this->uploader?->name,
            ],

            'uploaded_at' => $this->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}