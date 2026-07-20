<?php

declare(strict_types=1);

namespace App\Services\Signature;

use App\Models\User;
use App\Models\UserSignature;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

/**
 * Coordinates signature normalization, private storage, and persistence.
 *
 * Authentication and authorization remain the responsibility of callers.
 */
final readonly class SignatureService
{
    public function __construct(
        private SignatureNormalizer $normalizer,
        private SignatureHashService $hasher,
        private SignatureStorageService $storage,
    ) {}

    /**
     * Replace a user's active signature with a normalized PNG signature.
     *
     * The filesystem cannot participate in the database transaction, so a
     * newly stored file is deleted when the transaction cannot be committed.
     */
    public function upload(User $user, UploadedFile $file): UserSignature
    {
        $storedPath = null;

        try {
            return DB::transaction(function () use ($user, $file, &$storedPath): UserSignature {
                $normalizedImage = $this->normalizer->normalize($file);
                $sha256 = $this->hasher->hash($normalizedImage);

                $storedPath = $this->storage->store(
                    "signatures/{$user->getKey()}",
                    $normalizedImage,
                );

                $signature = $user->signatures()->create([
                    'public_id' => (string) Str::uuid(),
                    'disk' => 'private',
                    'path' => $storedPath,
                    'sha256' => $sha256,
                    'user_id' => $user->getKey(),
                    'is_active' => true,
                ]);

                $user->signatures()
                    ->where('is_active', true)
                    ->whereKeyNot($signature->getKey())
                    ->update(['is_active' => false]);

                return $signature;
            });
        } catch (Throwable $exception) {
            if ($storedPath !== null) {
                $this->storage->delete($storedPath);
            }

            throw $exception;
        }
    }

    /** Delete the persisted signature record and its private image. */
    public function delete(UserSignature $signature): void
    {
        $path = $signature->path;

        DB::transaction(fn () => $signature->delete());

        $this->storage->delete($path);
    }
}
