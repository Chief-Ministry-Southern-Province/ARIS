<?php

namespace Tests\Feature;

use App\Models\PasswordSetupToken;
use App\Models\User;
use App\Services\PasswordSetupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Tests\TestCase;

class PasswordSetupTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.textit', [
            'api_key' => 'test-api-key',
            'endpoint' => 'https://api.textit.biz/',
            'api_version' => 'v1',
            'timeout' => 15,
        ]);
        config()->set('password-setup.frontend_url', 'http://localhost:5173');
        config()->set('password-setup.expires_after_hours', 8);
    }

    public function test_a_setup_link_is_hashed_and_can_be_used_only_once(): void
    {
        Http::fake(['https://api.textit.biz/' => Http::response(['message' => 'Accepted'])]);
        $user = $this->newUser();

        app(PasswordSetupService::class)->sendSetupLink($user);

        $token = $this->tokenFromSms();
        $record = PasswordSetupToken::sole();
        $this->assertSame(hash('sha256', $token), $record->token_hash);
        $this->assertNotSame($token, $record->token_hash);

        app(PasswordSetupService::class)->complete($token, 'StrongPassword!2026');

        $this->assertTrue(Hash::check('StrongPassword!2026', $user->fresh()->password));
        $this->assertNotNull($record->fresh()->used_at);
        $this->expectException(RuntimeException::class);
        app(PasswordSetupService::class)->complete($token, 'AnotherStrong!2026');
    }

    public function test_a_resend_invalidates_the_earlier_unused_link(): void
    {
        Http::fake(['https://api.textit.biz/' => Http::response(['message' => 'Accepted'])]);
        $user = $this->newUser();
        $service = app(PasswordSetupService::class);

        $service->sendSetupLink($user);
        $oldToken = $this->tokenFromSms();
        $service->sendSetupLink($user);

        $this->expectException(RuntimeException::class);
        $service->validateToken($oldToken);
    }

    public function test_expired_links_are_rejected(): void
    {
        $record = PasswordSetupToken::create([
            'user_id' => $this->newUser()->id,
            'token_hash' => hash('sha256', 'expired-token'),
            'expires_at' => now()->subSecond(),
        ]);

        $this->expectException(RuntimeException::class);
        app(PasswordSetupService::class)->validateToken('expired-token');
    }

    public function test_public_setup_endpoints_validate_and_complete_a_valid_link(): void
    {
        $token = 'endpoint-token';
        $user = $this->newUser();
        PasswordSetupToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $token),
            'expires_at' => now()->addHours(8),
        ]);

        $this->postJson('/api/auth/password/setup/validate', ['token' => $token])
            ->assertOk()
            ->assertJson(['valid' => true]);

        $this->postJson('/api/auth/password/setup', [
            'token' => $token,
            'password' => 'StrongPassword!2026',
            'password_confirmation' => 'StrongPassword!2026',
        ])->assertOk()
            ->assertJsonPath('message', 'Password set successfully. You can now log in.');

        $this->assertTrue(Hash::check('StrongPassword!2026', $user->fresh()->password));
    }

    private function newUser(): User
    {
        return User::create([
            'name' => 'Setup User',
            'nic' => 'NIC'.fake()->unique()->numerify('########'),
            'mobile' => '0771234567',
            'password' => null,
        ]);
    }

    private function tokenFromSms(): string
    {
        $request = Http::recorded(fn (Request $request): bool => str_contains((string) $request['text'], '/set-password?token='))[0][0];
        preg_match('/[?&]token=([^\s]+)/', (string) $request['text'], $matches);

        return urldecode($matches[1]);
    }
}
