<?php

namespace App\Policies;

use App\Models\AccidentCase;
use App\Models\CaseHistory;
use App\Models\User;
use App\Services\InstitutionService;

class CaseHistoryPolicy
{
    public function viewForCase(User $user, AccidentCase $accidentCase): bool
    {
        return $this->canAccessCase($user, $accidentCase);
    }

    public function view(User $user, CaseHistory $caseHistory): bool
    {
        return $this->canAccessCase($user, $caseHistory->accidentCase);
    }

    /** Timeline records are created only by workflow services. */
    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, CaseHistory $caseHistory): bool
    {
        return false;
    }

    public function delete(User $user, CaseHistory $caseHistory): bool
    {
        return false;
    }

    private function canAccessCase(User $user, AccidentCase $accidentCase): bool
    {
        return ! $user->hasRole('driver')
            && app(InstitutionService::class)->canAccessInstitution($user, $accidentCase->institution);
    }
}
