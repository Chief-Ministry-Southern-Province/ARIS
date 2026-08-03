<?php

namespace App\Policies;

use App\Models\User;
use App\Models\WorkflowSetting;

class WorkflowSettingPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('system_admin');
    }

    public function view(User $user, WorkflowSetting $workflowSetting): bool
    {
        return $user->hasRole('system_admin');
    }

    /** The API updates a batch, so this is a class-level ability. */
    public function updateAny(User $user): bool
    {
        return $user->hasRole('system_admin');
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function delete(User $user, WorkflowSetting $workflowSetting): bool
    {
        return false;
    }
}
