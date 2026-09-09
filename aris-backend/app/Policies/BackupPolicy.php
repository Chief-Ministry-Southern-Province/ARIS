<?php

namespace App\Policies;

use App\Models\Backup;
use App\Models\User;

class BackupPolicy
{
    public function viewAny(User $user): bool { return $this->authorized($user, 'backup.view'); }
    public function view(User $user, Backup $backup): bool { return $this->authorized($user, 'backup.view'); }
    public function create(User $user): bool { return $this->authorized($user, 'backup.create'); }
    public function download(User $user, Backup $backup): bool { return $this->authorized($user, 'backup.download'); }
    public function delete(User $user, Backup $backup): bool { return $this->authorized($user, 'backup.delete'); }
    public function restore(User $user, Backup $backup): bool { return $this->authorized($user, 'backup.restore'); }

    private function authorized(User $user, string $permission): bool
    {
        return $user->hasRole('system_admin') || $user->can($permission);
    }
}
