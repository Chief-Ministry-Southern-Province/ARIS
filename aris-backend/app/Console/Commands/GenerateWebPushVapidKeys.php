<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Minishlink\WebPush\VAPID;

class GenerateWebPushVapidKeys extends Command
{
    protected $signature = 'webpush:generate-vapid';
    protected $description = 'Generate a VAPID key pair for Web Push configuration';

    public function handle(): int
    {
        $keys = VAPID::createVapidKeys();

        $this->warn('Generate this pair once and retain it. Do not rotate it while existing browser subscriptions are active.');
        $this->line('WEB_PUSH_VAPID_PUBLIC_KEY='.$keys['publicKey']);
        $this->line('WEB_PUSH_VAPID_PRIVATE_KEY='.$keys['privateKey']);
        $this->line('VITE_WEB_PUSH_PUBLIC_KEY='.$keys['publicKey']);

        return self::SUCCESS;
    }
}
