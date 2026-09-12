<?php

namespace App\Services;

use App\Models\PasswordSetupToken;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use RuntimeException;

class PasswordSetupService
{
    public function __construct(private TextitService $textit)
    {
    }

    /**
     * Creates a new one-time token, invalidates all earlier unused links and sends it by SMS.
     * The plain token exists only in memory while the message is being prepared.
     */
    public function sendSetupLink(User $user): void
    {
        $token = Str::random(64);
        $tokenHash = hash('sha256', $token);

        DB::transaction(function () use ($user, $tokenHash): void {
            PasswordSetupToken::query()
                ->where('user_id', $user->id)
                ->whereNull('used_at')
                ->delete();

            PasswordSetupToken::create([
                'user_id' => $user->id,
                'token_hash' => $tokenHash,
                'expires_at' => now()->addHours(config('password-setup.expires_after_hours')),
            ]);
        });

        try {
            $this->textit->send(
                $user->mobile,
                'ARIS account setup: '. $this->setupUrl($token).' This link expires in 8 hours.'
            );
        } catch (\Throwable $exception) {
            PasswordSetupToken::query()
                ->where('user_id', $user->id)
                ->where('token_hash', $tokenHash)
                ->delete();

            throw new RuntimeException('The setup SMS could not be sent. Please check the mobile number and use resend.', previous: $exception);
        }
    }

    public function validateToken(string $token): void
    {
        $this->findValidToken($token);
    }

    public function complete(string $token, string $password): User
    {
        return DB::transaction(function () use ($token, $password): User {
            $record = PasswordSetupToken::query()
                ->where('token_hash', hash('sha256', $token))
                ->lockForUpdate()
                ->first();

            $this->ensureUsable($record);

            $user = $record->user()->lockForUpdate()->firstOrFail();
            $user->forceFill(['password' => Hash::make($password)])->save();

            $record->forceFill(['used_at' => now()])->save();
            PasswordSetupToken::query()
                ->where('user_id', $user->id)
                ->whereNull('used_at')
                ->where('id', '!=', $record->id)
                ->delete();

            return $user;
        });
    }

    private function findValidToken(string $token): PasswordSetupToken
    {
        $record = PasswordSetupToken::query()
            ->where('token_hash', hash('sha256', $token))
            ->first();

        $this->ensureUsable($record);

        return $record;
    }

    private function ensureUsable(?PasswordSetupToken $record): void
    {
        if (! $record) {
            throw new RuntimeException('This password setup link is invalid.');
        }

        if ($record->used_at) {
            throw new RuntimeException('This password setup link has already been used.');
        }

        if ($record->expires_at->isPast()) {
            throw new RuntimeException('This password setup link has expired. Please ask an administrator to resend it.');
        }
    }

    private function setupUrl(string $token): string
    {
        return config('password-setup.frontend_url').'/set-password?token='.rawurlencode($token);
    }
}
