<?php

namespace App\Services;

use App\Models\FR1043;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class NotificationService
{
    public function notifyFR1043ChangesRequested(User $user, FR1043 $fr1043, string $comments): void
    {
        $data = [
            'type' => 'FR1043_CHANGES_REQUESTED',
            'fr1043_id' => $fr1043->id,
            'accident_case_id' => $fr1043->accident_case_id,
            'reference_number' => $fr1043->reference_number,
            'revision' => $fr1043->revision,
            'comments' => $comments,
        ];

        DB::afterCommit(static function () use ($user, $data): void {
            Notification::query()->create([
                'title' => 'Changes requested for FR1043',
                'message' => $data['comments'],
                'type' => $data['type'],
                'action_url' => "/cases/{$data['accident_case_id']}/FR104-3/generate",
                'read' => false,
                'data' => $data,
                'user_id' => $user->getKey(),
            ]);
        });
    }
}
