<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserNotificationCreated implements ShouldBroadcast, ShouldDispatchAfterCommit
{
    use Dispatchable, SerializesModels;

    public function __construct(public Notification $notification)
    {
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel('users.'.$this->notification->user_id);
    }

    public function broadcastAs(): string
    {
        return 'notification.created';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->notification->id,
            'type' => $this->notification->type,
            'title' => $this->notification->title,
            'message' => $this->notification->message,
            'action_url' => $this->notification->action_url,
            'data' => $this->notification->data,
            'created_at' => $this->notification->created_at?->toISOString(),
        ];
    }
}