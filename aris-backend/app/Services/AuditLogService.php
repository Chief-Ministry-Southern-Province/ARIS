<?php

namespace App\Services;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Arr;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class AuditLogService
{
    public function log(
        AuditAction $action,
        AuditModule $module,
        ?Model $model = null,
        array $oldValues = [],
        array $newValues = [],
        ?string $description = null,
        ?Request $request = null
    ): AuditLog {

        $user = Auth::user();
        $request ??= request()?->instance() instanceof Request ? request() : null;

        return AuditLog::create([

            'user_id' => $user?->id,

            'institution_id' => $user?->institution_id,

            'action' => $action->value,

            'module' => $module->value,

            'entity_type' => $model ? get_class($model) : null,

            'entity_id' => $model?->id,

            'entity_public_id' => $model && isset($model->public_id)
              ? $model->public_id
              : null,

            'old_values' => $this->sanitize($oldValues),

            'new_values' => $this->sanitize($newValues),

            'description' => $description,

            'ip_address' => $request?->ip(),
            'user_agent' => $request?->userAgent(),
            'url' => $request?->fullUrl(),
            'method' => $request?->method(),
        ]);
    }

    /** Never persist credentials, tokens, or signature content in audit data. */
    private function sanitize(array $values): array
    {
        return Arr::except($values, [
            'password', 'password_confirmation', 'current_password', 'new_password',
            'token', 'remember_token', 'otp', 'signature', 'signature_data',
        ]);
    }

    public function paginate(array $filters): LengthAwarePaginator
    {
        return AuditLog::query()
            ->with(['user:id,name,nic', 'institution:id,name'])
            ->when($filters['search'] ?? null, function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('description', 'like', "%{$search}%")
                        ->orWhere('entity_public_id', 'like', "%{$search}%")
                        ->orWhere('entity_type', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($users) => $users->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($filters['module'] ?? null, fn ($query, string $module) => $query->where('module', $module))
            ->when($filters['action'] ?? null, fn ($query, string $action) => $query->where('action', $action))
            ->when($filters['user_id'] ?? null, fn ($query, int $userId) => $query->where('user_id', $userId))
            ->when($filters['from'] ?? null, fn ($query, string $from) => $query->whereDate('created_at', '>=', $from))
            ->when($filters['to'] ?? null, fn ($query, string $to) => $query->whereDate('created_at', '<=', $to))
            ->latest()
            ->paginate(20)
            ->withQueryString();
    }
}
