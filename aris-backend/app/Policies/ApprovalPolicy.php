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
        return $user->id === $approval->approver_id
            ? Response::allow()
            : Response::denyAsNotFound();
    }

    public function approve(User $user, Approval $approval): Response
    {
        return $user->id === $approval->approver_id
            && $approval->status === 'PENDING'
            ? Response::allow()
            : Response::deny('You are not allowed to approve this workflow step.');
    }

    public function reject(User $user, Approval $approval): Response
    {
        return $user->id === $approval->approver_id
            && $approval->status === 'PENDING'
            ? Response::allow()
            : Response::deny('You are not allowed to reject this workflow step.');
    }

    public function delete(User $user, Approval $approval): bool
    {
        return false;
    }
}