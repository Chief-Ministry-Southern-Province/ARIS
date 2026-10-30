<?php

namespace App\Policies;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use App\Services\InstitutionManagementService;
use App\Services\InstitutionService;

class InstitutionPolicy
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
    public function view(User $user, Institution $institution): bool
    {
         return app(InstitutionService::class)->canAccessInstitution($user, $institution);
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
    public function update(User $user, Institution $institution): bool
    {
        return app(InstitutionService::class)->canAccessInstitution($user, $institution);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Institution $institution): bool
    {
        // Root ministry cannot be deleted
        if ($institution->type === 'MINISTRY' || is_null($institution->parent_institution_id)) {
            return false;
        }

        if ($user->isSystemAdmin()) {
            return true;
        }

        if ($user->hasRole('subject_officer')) {
            // Subject officers cannot delete their own institution
            if ($user->institution_id === $institution->id) {
                return false;
            }

            // Subject officers can only delete subordinate institutions under their institution
            return $institution->parent_institution_id === $user->institution_id
                && app(InstitutionService::class)->canAccessInstitution($user, $institution);
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Institution $institution): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Institution $institution): bool
    {
        return false;
    }
}
