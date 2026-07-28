<?php

declare(strict_types=1);

namespace App\Services\Signature;

use Illuminate\Support\Facades\Crypt;

/**
 * Encrypts and decrypts file contents using Laravel's configured encrypter.
 */
final class FileEncryptionService
{
    public function encrypt(string $contents): string
    {
        return Crypt::encryptString($contents);
    }

    public function decrypt(string $payload): string
    {
        return Crypt::decryptString($payload);
    }
}
