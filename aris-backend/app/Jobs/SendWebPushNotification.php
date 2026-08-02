<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Services\Notifications\WebPushService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWebPushNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 60;

    public function __construct(public Notification $notification)
    {
    }

    public function handle(WebPushService $webPush): void
    {
        $webPush->sendFor($this->notification);
    }
}
