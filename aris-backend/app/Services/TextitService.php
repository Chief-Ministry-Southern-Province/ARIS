<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class TextitService
{
    public function sendOtp(string $mobile, string|int $otp): void
    {
        $this->send($mobile, "Your ARIS verification code is: {$otp}");
    }

    public function send(string $mobile, string $message): void
    {
        $config = config('services.textit');

        if (blank($config['api_key'] ?? null)) {
            throw new RuntimeException('Textit.biz API key is not configured.');
        }

        $response = Http::asJson()
            ->acceptJson()
            ->timeout((int) ($config['timeout'] ?? 15))
            ->withHeaders([
                'X-API-VERSION' => $config['api_version'] ?? 'v1',
                'Authorization' => 'Basic '.$config['api_key'],
            ])
            ->post($config['endpoint'], [
                'to' => $this->normaliseSriLankanMobile($mobile),
                'text' => $message,
            ]);

        if (! $response->successful()) {
            throw new RuntimeException('Textit.biz could not send the verification code.');
        }
    }

    private function normaliseSriLankanMobile(string $mobile): string
    {
        $digits = preg_replace('/\D+/', '', $mobile) ?? '';

        if (str_starts_with($digits, '0')) {
            $digits = '94'.substr($digits, 1);
        }

        if (! preg_match('/^94\d{9}$/', $digits)) {
            throw new RuntimeException('A valid Sri Lankan mobile number is required to send an SMS.');
        }

        return $digits;
    }
}
