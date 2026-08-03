<?php

namespace App\Policies;

use App\Models\AccidentCase;
use App\Models\User;
use App\Services\InstitutionService;

class AccidentCasePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasRole('driver')) {
            return false;
        }

        return app(InstitutionService::class)
            ->accessibleInstitutionIds($user)
            !== [];
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AccidentCase $accidentCase): bool
    {
        if ($user->hasRole('driver')) {
            return false;
        }

        return app(InstitutionService::class)
            ->accessibleInstitutionIds($user)
            && app(InstitutionService::class)->canAccessInstitution($user, $accidentCase->institution);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(["subject_officer", "driver"]) &&
                app(InstitutionService::class)
                ->accessibleInstitutionIds($user)
                !== [];
    }

    /** 
     * Determine whether the user can update the model.
     */
    public function update(User $user, AccidentCase $accidentCase): bool
    {
        return $this->canAccessCase($user, $accidentCase)
            && $user->hasAnyRole(['system_admin', 'subject_officer']);
    }

    public function assign(User $user, AccidentCase $accidentCase): bool
    {
        return $this->update($user, $accidentCase)
            && in_array($accidentCase->status, ['OPEN', 'IN_PROGRESS'], true);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AccidentCase $accidentCase): bool
    {
        return $user->hasRole('subject_officer')
            && $this->canAccessCase($user, $accidentCase);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AccidentCase $accidentCase): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AccidentCase $accidentCase): bool
    {
        return false;
    }

    private function canAccessCase(User $user, AccidentCase $accidentCase): bool
    {
        return ! $user->hasRole('driver')
            && app(InstitutionService::class)->canAccessInstitution($user, $accidentCase->institution);
    }
}
