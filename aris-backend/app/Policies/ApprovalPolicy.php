<?php

namespace App\Policies;

use App\Models\Approval;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ApprovalPolicy
{
    
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Approval $approval): Response
    {
        $isAuthorized = $user->id === $approval->approver_id
            || app(\App\Services\Delegation\DelegationService::class)->isActingFor($user, $approval->approver_id)
            || $user->hasRole('system_admin');

        return $isAuthorized
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function approve(User $user, Approval $approval): Response
    {
        $isAuthorized = ($user->id === $approval->approver_id
            || app(\App\Services\Delegation\DelegationService::class)->isActingFor($user, $approval->approver_id))
            && $approval->status === 'PENDING';

        return $isAuthorized
            ? Response::allow()
            : Response::deny('You are not allowed to approve this workflow step.');
    }

    public function reject(User $user, Approval $approval): Response
    {
        $isAuthorized = ($user->id === $approval->approver_id
            || app(\App\Services\Delegation\DelegationService::class)->isActingFor($user, $approval->approver_id))
            && $approval->status === 'PENDING';

        return $isAuthorized
            ? Response::allow()
            : Response::deny('You are not allowed to reject this workflow step.');
    }

    public function reassign(User $user, Approval $approval): Response
    {
        $isAccessibleInstitution = $user->hasRole('system_admin')
            || in_array(
                $approval->institution_id,
                app(\App\Services\InstitutionService::class)->accessibleInstitutionIds($user),
                true
            );

        $canReassign = $user->hasAnyRole(['system_admin', 'institution_admin', 'subject_officer'])
            && $isAccessibleInstitution;

        return $canReassign && in_array($approval->status, ['PENDING', 'WAITING'], true)
            ? Response::allow()
            : Response::deny('You are not authorized to reassign this approval step.');
    }

    public function delete(User $user, Approval $approval): bool
    {
        return false;
    }
}