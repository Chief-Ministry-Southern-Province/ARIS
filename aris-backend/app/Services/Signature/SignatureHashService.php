<?php

declare(strict_types=1);

namespace App\Services\Signature;

use Intervention\Image\EncodedImage;

/** Creates deterministic SHA-256 hashes from encoded signature image bytes. */
final class SignatureHashService
{
    /** Return a lowercase hexadecimal SHA-256 hash for the encoded image. */
    public function hash(EncodedImage $image): string
    {
        return hash('sha256', $image->toString());
    }
}
