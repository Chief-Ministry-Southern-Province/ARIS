<?php

namespace App\Policies;

use App\Models\Accident;
use App\Models\User;
use App\Services\InstitutionService;
use Illuminate\Auth\Access\Response;

class AccidentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSystemAdmin() || $user->hasRole('subject_officer');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Accident $accident): bool
    {
        return app(InstitutionService::class)
            ->canAccessInstitution($user, $accident->institution);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isSystemAdmin() || $user->hasRole('subject_officer');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Accident $accident): bool
    {
        return app(InstitutionService::class)
            ->canAccessInstitution($user, $accident->institution);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Accident $accident): bool
    {
        return $user->isSystemAdmin() || $user->hasRole('subject_officer');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Accident $accident): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Accident $accident): bool
    {
        return false;
    }
}
