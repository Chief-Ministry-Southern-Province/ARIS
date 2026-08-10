<?php

namespace App\Policies;

use App\Models\AccidentCase;
use App\Models\FR109;
use App\Models\User;
use App\Services\InstitutionService;

class FR109Policy
{
    public function view(User $user, FR109 $fr109): bool
    {
        return $this->canAccessCase($user, $fr109->accidentCase);
    }

    public function viewForCase(User $user, AccidentCase $accidentCase): bool
    {
        return $this->canAccessCase($user, $accidentCase);
    }

    public function create(User $user, AccidentCase $accidentCase): bool
    {
        return $user->hasRole('subject_officer') && $this->canAccessCase($user, $accidentCase);
    }

    private function canAccessCase(User $user, AccidentCase $accidentCase): bool
    {
        return ! $user->hasAnyRole(['driver', 'system_admin'])
            && app(InstitutionService::class)->canAccessInstitution($user, $accidentCase->institution);
    }
}
