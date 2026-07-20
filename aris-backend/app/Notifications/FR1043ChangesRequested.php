<?php

namespace App\Notifications;

use App\Models\FR1043;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class FR1043ChangesRequested extends Notification
{
    use Queueable;

    public function __construct(
        private readonly FR1043 $fr1043,
        private readonly string $comments
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => 'FR1043_CHANGES_REQUESTED',
            'fr1043_id' => $this->fr1043->id,
            'accident_case_id' => $this->fr1043->accident_case_id,
            'reference_number' => $this->fr1043->reference_number,
            'revision' => $this->fr1043->revision,
            'comments' => $this->comments,
        ];
    }
}
