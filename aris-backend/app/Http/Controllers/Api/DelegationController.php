<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delegation\StoreDelegationRequest;
use App\Http\Resources\DelegationResource;
use App\Models\OfficerDelegation;
use App\Models\User;
use App\Services\Approval\ApprovalService;
use App\Services\Delegation\DelegationService;
use App\Services\InstitutionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DelegationController extends Controller
{
    public function __construct(
        protected DelegationService $delegationService,
        protected InstitutionService $institutionService,
    ) {}

    /**
     * List active and historical officer delegations.
     */
    public function index(Request $request)
    {
        $institutionId = $request->query('institution_id');
        $onlyActive = $request->boolean('active', false);

        if (! $request->user()->isSystemAdmin()) {
            $accessibleIds = $this->institutionService->accessibleInstitutionIds($request->user());
            if ($institutionId && ! in_array((int) $institutionId, $accessibleIds, true)) {
                abort(403, 'Unauthorized institution access.');
            }
            $institutionId = $institutionId ?? $request->user()->institution_id;
        }

        $delegations = $this->delegationService->listDelegations(
            institutionId: $institutionId ? (int) $institutionId : null,
            onlyActive: $onlyActive,
        );

        return DelegationResource::collection($delegations);
    }

    /**
     * Create an acting officer delegation.
     */
    public function store(StoreDelegationRequest $request): JsonResponse
    {
        $delegation = $this->delegationService->createDelegation(
            creator: $request->user(),
            data: $request->validated(),
        );

        return (new DelegationResource($delegation->load(['officer.roles', 'actingOfficer.roles', 'institution', 'creator'])))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Revoke an active delegation.
     */
    public function destroy(Request $request, OfficerDelegation $delegation): JsonResponse
    {
        if (! $request->user()->hasAnyRole(['system_admin', 'institution_admin', 'secretary', 'chief_secretary', 'subject_officer'])) {
            abort(403, 'Unauthorized to revoke officer delegations.');
        }

        if (! $request->user()->isSystemAdmin()) {
            $accessibleIds = $this->institutionService->accessibleInstitutionIds($request->user());
            if (! in_array($delegation->institution_id, $accessibleIds, true)) {
                abort(403, 'Unauthorized to revoke this delegation.');
            }
        }

        $reason = $request->input('reason');
        $revoked = $this->delegationService->revokeDelegation($delegation, $request->user(), $reason);

        return response()->json([
            'message' => 'Officer delegation revoked successfully.',
            'data' => new DelegationResource($revoked->load(['officer.roles', 'actingOfficer.roles', 'institution', 'creator'])),
        ]);
    }

    /**
     * Handover workload from a resigning/departing user to a successor.
     */
    public function handover(Request $request, User $user, ApprovalService $approvalService): JsonResponse
    {
        if (! $request->user()->hasAnyRole(['system_admin', 'institution_admin', 'subject_officer'])) {
            abort(403, 'Only administrators and subject officers can perform user workload handovers.');
        }

        if (! $request->user()->isSystemAdmin()) {
            $accessibleIds = $this->institutionService->accessibleInstitutionIds($request->user());
            if (! in_array($user->institution_id, $accessibleIds, true)) {
                abort(403, 'Unauthorized institution access for user workload handover.');
            }
        }

        $validated = $request->validate([
            'successor_id' => ['required', 'integer', 'exists:users,id', 'different:'.$user->id],
            'reason' => ['required', 'string', 'max:500'],
            'deactivate_departing_user' => ['nullable', 'boolean'],
        ]);

        $successor = User::findOrFail($validated['successor_id']);

        if (! $successor->is_active) {
            abort(422, 'The successor user must be active.');
        }

        $result = $approvalService->handoverWorkload(
            departingUser: $user,
            successorUser: $successor,
            actor: $request->user(),
            reason: $validated['reason'],
        );

        if (! empty($validated['deactivate_departing_user'])) {
            $user->update([
                'is_active' => false,
                'deactivated_at' => now(),
                'deactivation_reason' => $validated['reason'],
            ]);
        }

        return response()->json([
            'message' => 'Workload successfully handed over.',
            'reassigned_cases' => $result['reassigned_cases'],
            'reassigned_approvals' => $result['reassigned_approvals'],
            'departing_user_deactivated' => ! empty($validated['deactivate_departing_user']),
        ]);
    }

    /**
     * Update user active status (activate / deactivate).
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        if (! $request->user()->hasAnyRole(['system_admin', 'institution_admin', 'subject_officer'])) {
            abort(403, 'Unauthorized to update user status.');
        }

        if (! $request->user()->isSystemAdmin()) {
            $accessibleIds = $this->institutionService->accessibleInstitutionIds($request->user());
            if (! in_array($user->institution_id, $accessibleIds, true)) {
                abort(403, 'Unauthorized institution access to update user status.');
            }
        }

        $validated = $request->validate([
            'is_active' => ['required', 'boolean'],
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $user->update([
            'is_active' => $validated['is_active'],
            'deactivated_at' => $validated['is_active'] ? null : now(),
            'deactivation_reason' => $validated['is_active'] ? null : ($validated['reason'] ?? 'Deactivated by administrator'),
        ]);

        return response()->json([
            'message' => $validated['is_active'] ? 'User activated successfully.' : 'User deactivated successfully.',
            'user' => $user->fresh(['institution', 'roles']),
        ]);
    }
}
