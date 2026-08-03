<?php

namespace App\Policies;

use App\Models\AuditLog;
use App\Models\User;

class AuditLogPolicy
{
    /** Audit records contain sensitive personal and security data. */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('system_admin');
    }

    public function view(User $user, AuditLog $auditLog): bool
    {
        return $user->hasRole('system_admin');
    }

    /** Audit records are created only by trusted application services. */
    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, AuditLog $auditLog): bool
    {
        return false;
    }

    public function delete(User $user, AuditLog $auditLog): bool
    {
        return false;
    }
}
