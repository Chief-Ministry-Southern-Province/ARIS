<?php

declare(strict_types=1);

namespace App\Services\Signature;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Colors\Rgb\Color;
use Intervention\Image\EncodedImage;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\Exceptions\ImageDecoderException;
use Intervention\Image\Interfaces\ImageManagerInterface;
use RuntimeException;

/**
 * Normalizes an uploaded signature image entirely in memory.
 *
 * This service deliberately has no filesystem, database, authentication,
 * authorization, or domain-model dependencies.
 */
final readonly class SignatureNormalizer
{
    private const CANVAS_WIDTH = 600;
    private const CANVAS_HEIGHT = 200;

    public function __construct(
        private ImageManagerInterface $images,
    ) {}

    /**
     * Decode, fit, center, and re-encode an uploaded signature as PNG.
     */
    public function normalize(UploadedFile $file): EncodedImage
    {
        if (!$file->isValid() || $file->getRealPath() === false) {
            throw new \InvalidArgumentException('The signature upload is invalid.');
        }

        try {
            $image = $this->images->decodePath($file->getRealPath());
        } catch (ImageDecoderException $exception) {
            throw new \InvalidArgumentException('The signature upload is not a decodable image.', previous: $exception);
        }

        $encoded = $image
            ->contain(
                self::CANVAS_WIDTH,
                self::CANVAS_HEIGHT,
                new Color(0, 0, 0, 0.0),
            )
            ->encode(new PngEncoder());

        if (!$encoded instanceof EncodedImage) {
            throw new RuntimeException('The signature image could not be encoded as PNG.');
        }

        return $encoded;
    }
}
