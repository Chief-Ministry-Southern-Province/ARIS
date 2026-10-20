<?php

namespace App\Services\Delegation;

use App\Enums\AuditAction;
use App\Enums\AuditModule;
use App\Models\Institution;
use App\Models\OfficerDelegation;
use App\Models\User;
use App\Services\AuditLogService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class DelegationService
{
    public function __construct(
        protected AuditLogService $auditLogs,
    ) {}

    /**
     * Check if a user is currently authorized to act on behalf of another officer.
     */
    public function isActingFor(User $actingUser, User|int $targetOfficer): bool
    {
        $targetOfficerId = $targetOfficer instanceof User ? $targetOfficer->id : $targetOfficer;

        if ($actingUser->id === $targetOfficerId) {
            return false;
        }

        return OfficerDelegation::query()
            ->where('acting_officer_id', $actingUser->id)
            ->where('officer_id', $targetOfficerId)
            ->active()
            ->exists();
    }

    /**
     * Find active delegation linking an acting officer to a target officer.
     */
    public function findActiveDelegation(User $actingUser, User|int $targetOfficer): ?OfficerDelegation
    {
        $targetOfficerId = $targetOfficer instanceof User ? $targetOfficer->id : $targetOfficer;

        return OfficerDelegation::query()
            ->where('acting_officer_id', $actingUser->id)
            ->where('officer_id', $targetOfficerId)
            ->active()
            ->first();
    }

    /**
     * Get list of officer IDs that the given user is currently acting for.
     */
    public function getActingForOfficerIds(User $actingUser): array
    {
        return OfficerDelegation::query()
            ->where('acting_officer_id', $actingUser->id)
            ->active()
            ->pluck('officer_id')
            ->all();
    }

    /**
     * Create a new officer delegation (acting / covering duties).
     */
    public function createDelegation(User $creator, array $data): OfficerDelegation
    {
        if ($data['officer_id'] === $data['acting_officer_id']) {
            throw ValidationException::withMessages([
                'acting_officer_id' => 'An officer cannot be assigned to act for themselves.',
            ]);
        }

        $officer = User::findOrFail($data['officer_id']);
        $actingOfficer = User::findOrFail($data['acting_officer_id']);

        if (! $actingOfficer->is_active) {
            throw ValidationException::withMessages([
                'acting_officer_id' => 'The selected acting officer is inactive.',
            ]);
        }

        // Ensure acting officer has compatible role
        if (! $actingOfficer->hasRole($data['role'])) {
            throw ValidationException::withMessages([
                'acting_officer_id' => "The acting officer must have the role '{$data['role']}'.",
            ]);
        }

        $delegation = OfficerDelegation::create([
            'institution_id' => $data['institution_id'] ?? $officer->institution_id,
            'officer_id' => $officer->id,
            'acting_officer_id' => $actingOfficer->id,
            'role' => $data['role'],
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'] ?? null,
            'reason' => $data['reason'],
            'notes' => $data['notes'] ?? null,
            'is_active' => true,
            'created_by' => $creator->id,
        ]);

        $this->auditLogs->log(
            AuditAction::CREATE,
            AuditModule::WORKFLOW,
            $delegation,
            null,
            $delegation->toArray(),
            "Designated {$actingOfficer->name} as acting officer for {$officer->name} ({$delegation->role}).",
        );

        return $delegation;
    }

    /**
     * Revoke an active delegation.
     */
    public function revokeDelegation(OfficerDelegation $delegation, User $actor, ?string $reason = null): OfficerDelegation
    {
        $oldValues = $delegation->toArray();

        $delegation->update([
            'is_active' => false,
            'notes' => $reason ? trim(($delegation->notes ?? '') . "\nRevoked: {$reason}") : $delegation->notes,
        ]);

        $this->auditLogs->log(
            AuditAction::UPDATE,
            AuditModule::WORKFLOW,
            $delegation,
            $oldValues,
            $delegation->toArray(),
            "Revoked acting officer delegation for {$delegation->officer?->name}.",
        );

        return $delegation;
    }

    /**
     * List delegations for an institution or system.
     */
    public function listDelegations(?int $institutionId = null, bool $onlyActive = false): Collection
    {
        return OfficerDelegation::query()
            ->when($institutionId, fn ($q) => $q->where('institution_id', $institutionId))
            ->when($onlyActive, fn ($q) => $q->active())
            ->with(['officer', 'actingOfficer', 'institution', 'creator'])
            ->latest()
            ->get();
    }
}
