<?php

declare(strict_types=1);

namespace App\Services\Signature;

use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Support\Str;
use Intervention\Image\EncodedImage;
use RuntimeException;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * Filesystem-only storage for encoded signature images.
 *
 * Callers own all authentication, authorization, image transformation, and
 * persistence decisions. Encryption is delegated to FileEncryptionService.
 */
final readonly class SignatureStorageService
{
    public function __construct(
        private FilesystemManager $filesystem,
        private FileEncryptionService $encryption,
    ) {}

    /** Store an encoded image on the private disk and return its relative path. */
    public function store(string $directory, EncodedImage $image): string
    {
        $directory = trim($directory, '/');

        if ($directory === '') {
            throw new \InvalidArgumentException('A storage directory is required.');
        }

        $path = sprintf(
            '%s/%s.%s',
            $directory,
            Str::uuid(),
            $this->extensionFor($image),
        );

        if (!$this->disk()->put($path, $this->encryption->encrypt($image->toString()))) {
            throw new RuntimeException("Unable to store image at [{$path}].");
        }

        return $path;
    }

    /** Delete a path when it exists on the private disk. */
    public function delete(string $path): void
    {
        if ($this->exists($path)) {
            $this->disk()->delete($path);
        }
    }

    /** Determine whether a relative path exists on the private disk. */
    public function exists(string $path): bool
    {
        return $this->disk()->exists($path);
    }

    /** Stream a decrypted private file response. Authorization belongs to the caller. */
    public function response(string $path): StreamedResponse
    {
        abort_unless($this->exists($path), 404);

        $contents = $this->encryption->decrypt($this->disk()->get($path));

        return new StreamedResponse(
            static function () use ($contents): void {
                echo $contents;
            },
            200,
            [
                'Content-Type' => 'image/png',
                'Content-Disposition' => sprintf('inline; filename="%s"', basename($path)),
            ],
        );
    }

    private function disk(): FilesystemAdapter
    {
        return $this->filesystem->disk('private');
    }

    private function extensionFor(EncodedImage $image): string
    {
        return match ($image->mediaType()) {
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif',
            'image/avif' => 'avif',
            default => 'bin',
        };
    }
}
