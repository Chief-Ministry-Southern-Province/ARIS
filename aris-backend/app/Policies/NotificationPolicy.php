<?php

namespace App\Policies;

use App\Models\Notification;
use App\Models\User;

class NotificationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Notification $notification): bool
    {
        return $notification->user_id === $user->id;
    }

    public function update(User $user, Notification $notification): bool
    {
        return $notification->user_id === $user->id;
    }

    /** Marking all notifications read is always limited to the current user. */
    public function markAll(User $user): bool
    {
        return true;
    }

    /** Notifications are created only by trusted workflow services. */
    public function create(User $user): bool
    {
        return false;
    }

    public function delete(User $user, Notification $notification): bool
    {
        return false;
    }
}
