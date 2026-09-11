<?php

namespace Tests\Feature;

use App\Services\TextitService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class TextitServiceTest extends TestCase
{
    public function test_it_sends_an_otp_to_textit_using_a_normalised_mobile_number(): void
    {
        config()->set('services.textit', [
            'api_key' => 'test-api-key',
            'endpoint' => 'https://api.textit.biz/',
            'api_version' => 'v1',
            'timeout' => 15,
        ]);

        Http::fake([
            'https://api.textit.biz/' => Http::response(['message' => 'Accepted']),
        ]);

        app(TextitService::class)->sendOtp('0771234567', 123456);

        Http::assertSent(function (Request $request): bool {
            return $request->url() === 'https://api.textit.biz/'
                && $request->hasHeader('Authorization', 'Basic test-api-key')
                && $request->hasHeader('X-API-VERSION', 'v1')
                && $request['to'] === '94771234567'
                && $request['text'] === 'Your ARIS verification code is: 123456';
        });
    }
}
