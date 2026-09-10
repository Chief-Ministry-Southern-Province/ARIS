<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BackupResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id, 'backup_code' => $this->backup_code, 'type' => $this->type,
            'status' => $this->status, 'file_name' => $this->file_name, 'file_size' => $this->file_size,
            'started_at' => $this->started_at?->toIso8601String(), 'completed_at' => $this->completed_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(), 'error_message' => $this->when($request->user()?->can('view', $this->resource), $this->error_message),
            'creator' => $this->whenLoaded('creator', fn () => ['id' => $this->creator?->id, 'name' => $this->creator?->name]),
            'restore' => $this->whenLoaded('latestRestore', fn () => $this->latestRestore ? [
                'id' => $this->latestRestore->id,
                'status' => $this->latestRestore->status,
                'message' => $this->latestRestore->message,
                'started_at' => $this->latestRestore->started_at?->toIso8601String(),
                'completed_at' => $this->latestRestore->completed_at?->toIso8601String(),
            ] : null),
            'permissions' => [
                'download' => $request->user()?->can('download', $this->resource) ?? false,
                'delete' => $request->user()?->can('delete', $this->resource) ?? false,
                'restore' => config('backups.restore_enabled') && ($request->user()?->can('restore', $this->resource) ?? false),
            ],
        ];
    }
}
