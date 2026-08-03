<?php

namespace App\Policies;

use App\Models\AccidentCase;
use App\Models\FR1043;
use App\Models\User;
use App\Services\InstitutionService;

class FR1043Policy
{
    public function viewAny(User $user): bool
    {
        return ! $user->hasAnyRole(['driver', 'system_admin'])
            && app(InstitutionService::class)->canAccessInstitution($user);
    }

    /** Authorize the case-scoped latest-form and history endpoints. */
    public function viewForCase(User $user, AccidentCase $accidentCase): bool
    {
        return $this->canAccessCase($user, $accidentCase);
    }

    public function view(User $user, FR1043 $fr1043): bool
    {
        return $this->canAccessCase($user, $fr1043->accidentCase);
    }

    public function create(User $user, AccidentCase $accidentCase): bool
    {
        return $user->hasRole('subject_officer')
            && $this->canAccessCase($user, $accidentCase);
    }

    public function update(User $user, FR1043 $fr1043): bool
    {
        return $fr1043->created_by === $user->id
            && in_array($fr1043->status, ['DRAFT', 'CHANGES_REQUESTED'], true);
    }

    public function submit(User $user, FR1043 $fr1043): bool
    {
        return $fr1043->created_by === $user->id
            && $fr1043->status === 'DRAFT';
    }

    private function canAccessCase(User $user, AccidentCase $accidentCase): bool
    {
        return ! ! $user->hasAnyRole(['driver', 'system_admin'])
            && app(InstitutionService::class)->canAccessInstitution($user, $accidentCase->institution);
    }
}
