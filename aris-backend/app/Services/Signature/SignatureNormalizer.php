<?php

declare(strict_types=1);

namespace App\Services\Signature;

use Illuminate\Http\UploadedFile;
use Intervention\Image\Colors\Rgb\Color;
use Intervention\Image\EncodedImage;
use Intervention\Image\Encoders\PngEncoder;
use Intervention\Image\Exceptions\ImageDecoderException;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use RuntimeException;

final readonly class SignatureNormalizer
{
    private const CANVAS_WIDTH = 600;
    private const CANVAS_HEIGHT = 200;
    private const PADDING = 10;
    private const TRANSPARENT_ALPHA_THRESHOLD = 126;

    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    public function normalize(UploadedFile $file): EncodedImage
    {
        if (! $file->isValid()) {
            throw new \InvalidArgumentException('The signature upload is invalid.');
        }

        try {
            // A drawn signature is submitted as a full canvas.  Keeping that
            // canvas means the actual ink occupies only a very small part of
            // the fixed PDF signature area.  Crop the transparent margin
            // before applying the shared maximum dimensions.
            $image = $this->imageManager->decodeBinary(
                $this->trimTransparentMargins($file->get()),
            );
        } catch (ImageDecoderException $exception) {
            throw new \InvalidArgumentException(
                'The signature upload is not a decodable image.',
                previous: $exception
            );
        }

        $encoded = $image
            ->contain(
                self::CANVAS_WIDTH,
                self::CANVAS_HEIGHT,
                new Color(0, 0, 0, 0.0),
            )
            ->encode(new PngEncoder());

        if (! $encoded instanceof EncodedImage) {
            throw new RuntimeException('The signature image could not be encoded as PNG.');
        }

        return $encoded;
    }

    private function trimTransparentMargins(string $contents): string
    {
        $image = @imagecreatefromstring($contents);

        if ($image === false) {
            throw new \InvalidArgumentException('The signature upload is not a decodable image.');
        }

        try {
            $width = imagesx($image);
            $height = imagesy($image);
            $left = $width;
            $top = $height;
            $right = -1;
            $bottom = -1;

            for ($y = 0; $y < $height; $y++) {
                for ($x = 0; $x < $width; $x++) {
                    if ($this->isTransparent($image, $x, $y)) {
                        continue;
                    }

                    $left = min($left, $x);
                    $top = min($top, $y);
                    $right = max($right, $x);
                    $bottom = max($bottom, $y);
                }
            }

            if ($right === -1) {
                throw new \InvalidArgumentException('The signature upload is empty.');
            }

            $cropLeft = max(0, $left - self::PADDING);
            $cropTop = max(0, $top - self::PADDING);
            $cropRight = min($width - 1, $right + self::PADDING);
            $cropBottom = min($height - 1, $bottom + self::PADDING);
            $cropWidth = $cropRight - $cropLeft + 1;
            $cropHeight = $cropBottom - $cropTop + 1;
            $cropped = imagecreatetruecolor($cropWidth, $cropHeight);

            if ($cropped === false) {
                throw new RuntimeException('Unable to create the signature image canvas.');
            }

            try {
                imagealphablending($cropped, false);
                imagesavealpha($cropped, true);
                $transparent = imagecolorallocatealpha($cropped, 0, 0, 0, 127);
                imagefill($cropped, 0, 0, $transparent);
                imagecopy($cropped, $image, 0, 0, $cropLeft, $cropTop, $cropWidth, $cropHeight);

                ob_start();
                $written = imagepng($cropped, null, 6);
                $trimmed = ob_get_clean();

                if (! $written || ! is_string($trimmed)) {
                    throw new RuntimeException('Unable to encode the normalized signature.');
                }

                return $trimmed;
            } finally {
                imagedestroy($cropped);
            }
        } finally {
            imagedestroy($image);
        }
    }

    private function isTransparent(\GdImage $image, int $x, int $y): bool
    {
        $color = imagecolorat($image, $x, $y);

        if (imageistruecolor($image)) {
            return (($color >> 24) & 0x7F) >= self::TRANSPARENT_ALPHA_THRESHOLD;
        }

        return imagecolorsforindex($image, $color)['alpha'] >= self::TRANSPARENT_ALPHA_THRESHOLD;
    }
}
