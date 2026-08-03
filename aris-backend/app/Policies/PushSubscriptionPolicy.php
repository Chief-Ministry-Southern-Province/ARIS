<?php

namespace App\Policies;

use App\Models\PushSubscription;
use App\Models\User;

class PushSubscriptionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, PushSubscription $pushSubscription): bool
    {
        return $pushSubscription->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, PushSubscription $pushSubscription): bool
    {
        return $pushSubscription->user_id === $user->id;
    }

    public function delete(User $user, PushSubscription $pushSubscription): bool
    {
        return $pushSubscription->user_id === $user->id;
    }
}
