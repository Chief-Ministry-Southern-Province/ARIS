<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserSignature;
use Illuminate\Auth\Access\Response;

class UserSignaturePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user,UserSignature $signature): bool
    {
        return $user->id === $signature->user_id;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, UserSignature $userSignature): bool
    {
        return $user->id === $userSignature->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, UserSignature $userSignature): bool
    {
        return $user->id === $userSignature->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, UserSignature $userSignature): bool
    {
        return $user->id === $userSignature->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, UserSignature $userSignature): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, UserSignature $userSignature): bool
    {
        return false;
    }
}
