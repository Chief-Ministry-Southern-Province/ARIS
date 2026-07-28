<?php

namespace App\Http\Controllers\Api;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Services\AuditLogService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AuditLogController extends Controller
{
    public function __construct(private AuditLogService $auditLogs)
    {
    }

    public function index(Request $request)
    {
        abort_unless($request->user()?->hasRole('system_admin'), 403);

        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'module' => ['nullable', Rule::in(array_map(fn (AuditModule $item) => $item->value, AuditModule::cases()))],
            'action' => ['nullable', Rule::in(array_map(fn (AuditAction $item) => $item->value, AuditAction::cases()))],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);

        return AuditLogResource::collection($this->auditLogs->paginate($filters));
    }
}
