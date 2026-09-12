<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\TextitService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendTextitSmsNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public int $timeout = 30;

    public function __construct(
        public int $userId,
        public string $message,
    ) {}

    public function handle(TextitService $textit): void
    {
        $user = User::query()->find($this->userId);

        if (! $user || blank($user->mobile)) {
            return;
        }

        $textit->send($user->mobile, $this->message);
    }
}
