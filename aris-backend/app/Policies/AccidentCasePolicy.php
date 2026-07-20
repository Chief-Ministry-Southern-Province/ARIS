<?php

namespace App\Policies;

use App\Models\AccidentCase;
use App\Models\User;
use Illuminate\Auth\Access\Response;

use App\Services\InstitutionService;

class AccidentCasePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user->hasRole(['system_admin','driver'])) {
            return false;
        }

        return app(InstitutionService::class)
            ->accessibleInstitutionIds($user->institution_id)
            ->isNotEmpty();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AccidentCase $accidentCase): bool
    {
        if ($user->hasRole(['system_admin','driver'])) {
            return false;
        }

        return app(InstitutionService::class)
            ->accessibleInstitutionIds($user->institution_id)
            ->contains($accidentCase->institution_id);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(["subject_officer", "driver"]) &&
                app(InstitutionService::class)
                ->accessibleInstitutionIds($user->institution_id)
                ->isNotEmpty();
    }

    /** 
     * Determine whether the user can update the model.
     */
    public function update(User $user, AccidentCase $accidentCase): bool
    {
        return $user->hasRole("subject_officer") &&
                app(InstitutionService::class)
                    ->accessibleInstitutionIds($user->institution_id)
                    ->contains($accidentCase->institution_id);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AccidentCase $accidentCase): bool
    {
        return $user->hasRole("subject_officer") &&
                app(InstitutionService::class)
                    ->accessibleInstitutionIds($user->institution_id)
                    ->contains($accidentCase->institution_id);
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
}
