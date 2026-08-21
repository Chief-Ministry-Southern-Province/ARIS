<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\UserSignature;
use App\Services\Signature\FileEncryptionService;
use Illuminate\Console\Command;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Filesystem\FilesystemManager;
use Illuminate\Support\Str;
use Throwable;

final class TrimStoredSignatures extends Command
{
    private const PADDING = 10;

    private const MARGIN_TOLERANCE = 2;

    protected $signature = 'signatures:trim
        {--dry-run : Report changes without writing files, backups, or database values}
        {--chunk=100 : Number of signature records to process at a time}
        {--backup-directory=signature-trim-backups : Private-disk directory for encrypted originals}';

    protected $description = 'Trim transparent margins from stored user signature PNGs with encrypted backups.';

    /** @var array{scanned:int,trimmed:int,already_trimmed:int,empty:int,failed:int} */
    private array $summary = [
        'scanned' => 0,
        'trimmed' => 0,
        'already_trimmed' => 0,
        'empty' => 0,
        'failed' => 0,
    ];

    public function handle(FilesystemManager $filesystem, FileEncryptionService $encryption): int
    {
        if (! function_exists('imagecreatefromstring')) {
            $this->error('The GD extension is required to trim stored signatures.');

            return self::FAILURE;
        }

        $chunkSize = max(1, (int) $this->option('chunk'));
        $dryRun = (bool) $this->option('dry-run');
        $backupRoot = trim((string) $this->option('backup-directory'), '/');
        $runId = now()->format('Ymd_His').'_'.Str::lower(Str::random(6));
        $disk = $filesystem->disk('private');
        $manifestPath = storage_path("logs/signature-trim-{$runId}.jsonl");

        $this->info($dryRun ? 'Dry run: no files or database records will be changed.' : 'Trimming stored signatures.');

        UserSignature::query()
            ->orderBy('id')
            ->chunkById($chunkSize, function ($signatures) use ($disk, $encryption, $dryRun, $backupRoot, $runId, $manifestPath): void {
                foreach ($signatures as $signature) {
                    $this->trimSignature($signature, $disk, $encryption, $dryRun, $backupRoot, $runId, $manifestPath);
                }
            });

        $this->newLine();
        $this->table(
            ['Scanned', 'Trimmed', 'Already trimmed', 'Empty', 'Failed'],
            [[
                $this->summary['scanned'],
                $this->summary['trimmed'],
                $this->summary['already_trimmed'],
                $this->summary['empty'],
                $this->summary['failed'],
            ]],
        );

        if (! $dryRun && $this->summary['trimmed'] > 0) {
            $this->line("Backup manifest: {$manifestPath}");
            $this->line("Encrypted originals: private://{$backupRoot}/{$runId}");
        }

        return $this->summary['failed'] === 0 ? self::SUCCESS : self::FAILURE;
    }

    private function trimSignature(
        UserSignature $signature,
        FilesystemAdapter $disk,
        FileEncryptionService $encryption,
        bool $dryRun,
        string $backupRoot,
        string $runId,
        string $manifestPath,
    ): void {
        $this->summary['scanned']++;

        try {
            $path = $signature->path;

            if ($path === '' || ! $disk->exists($path)) {
                throw new \RuntimeException('Stored signature file was not found.');
            }

            $encryptedOriginal = $disk->get($path);
            $original = $encryption->decrypt($encryptedOriginal);
            $image = @imagecreatefromstring($original);

            if ($image === false) {
                throw new \RuntimeException('Signature is not a decodable image.');
            }

            try {
                $dimensions = $this->dimensions($image);

                if ($dimensions === null) {
                    $this->summary['empty']++;
                    $this->warn("[{$signature->id}] skipped: image is fully transparent.");

                    return;
                }

                [$left, $top, $right, $bottom] = $dimensions;
                $width = imagesx($image);
                $height = imagesy($image);
                $margins = [$left, $top, $width - 1 - $right, $height - 1 - $bottom];

                if (max($margins) <= self::PADDING + self::MARGIN_TOLERANCE) {
                    $this->summary['already_trimmed']++;
                    $this->line("[{$signature->id}] skipped: already trimmed ({$width}x{$height}).");

                    return;
                }

                $cropped = $this->cropWithPadding($image, $left, $top, $right, $bottom, $width, $height);

                try {
                    $trimmedPng = $this->encodePng($cropped);
                } finally {
                    imagedestroy($cropped);
                }

                $newSize = getimagesizefromstring($trimmedPng);

                if ($newSize === false) {
                    throw new \RuntimeException('Trimmed signature could not be inspected.');
                }

                $savedBytes = max(0, strlen($original) - strlen($trimmedPng));
                $message = sprintf(
                    '[%d] %dx%d -> %dx%d, %d bytes saved',
                    $signature->id,
                    $width,
                    $height,
                    $newSize[0],
                    $newSize[1],
                    $savedBytes,
                );

                if ($dryRun) {
                    $this->summary['trimmed']++;
                    $this->info("Would trim {$message}");

                    return;
                }

                $backupPath = sprintf('%s/%s/%d-%s', $backupRoot, $runId, $signature->id, basename($path));

                if (! $disk->put($backupPath, $encryptedOriginal)) {
                    throw new \RuntimeException('Unable to write the encrypted signature backup.');
                }

                if (! $disk->put($path, $encryption->encrypt($trimmedPng))) {
                    throw new \RuntimeException('Unable to write the trimmed signature.');
                }

                $signature->forceFill([
                    'sha256' => hash('sha256', $trimmedPng),
                ])->save();

                $this->appendManifest($manifestPath, [
                    'signature_id' => $signature->id,
                    'public_id' => $signature->public_id,
                    'path' => $path,
                    'backup_path' => $backupPath,
                    'previous_sha256' => $signature->sha256,
                    'original_sha256' => hash('sha256', $original),
                    'trimmed_sha256' => hash('sha256', $trimmedPng),
                    'old_dimensions' => "{$width}x{$height}",
                    'new_dimensions' => "{$newSize[0]}x{$newSize[1]}",
                    'bytes_saved' => $savedBytes,
                    'trimmed_at' => now()->toIso8601String(),
                ]);

                $this->summary['trimmed']++;
                $this->info("Trimmed {$message}");
            } finally {
                imagedestroy($image);
            }
        } catch (Throwable $exception) {
            $this->summary['failed']++;
            $this->error("[{$signature->id}] failed: {$exception->getMessage()}");
        }
    }

    /** @return array{0:int,1:int,2:int,3:int}|null */
    private function dimensions(\GdImage $image): ?array
    {
        $left = imagesx($image);
        $top = imagesy($image);
        $right = -1;
        $bottom = -1;

        for ($y = 0; $y < imagesy($image); $y++) {
            for ($x = 0; $x < imagesx($image); $x++) {
                if ($this->isTransparent($image, $x, $y)) {
                    continue;
                }

                $left = min($left, $x);
                $top = min($top, $y);
                $right = max($right, $x);
                $bottom = max($bottom, $y);
            }
        }

        return $right === -1 ? null : [$left, $top, $right, $bottom];
    }

    private function isTransparent(\GdImage $image, int $x, int $y): bool
    {
        $color = imagecolorat($image, $x, $y);

        if (imageistruecolor($image)) {
            return (($color >> 24) & 0x7F) >= 126;
        }

        return imagecolorsforindex($image, $color)['alpha'] >= 126;
    }

    private function cropWithPadding(\GdImage $image, int $left, int $top, int $right, int $bottom, int $width, int $height): \GdImage
    {
        $cropLeft = max(0, $left - self::PADDING);
        $cropTop = max(0, $top - self::PADDING);
        $cropRight = min($width - 1, $right + self::PADDING);
        $cropBottom = min($height - 1, $bottom + self::PADDING);
        $cropWidth = $cropRight - $cropLeft + 1;
        $cropHeight = $cropBottom - $cropTop + 1;

        $cropped = imagecreatetruecolor($cropWidth, $cropHeight);

        if ($cropped === false) {
            throw new \RuntimeException('Unable to create the cropped image canvas.');
        }

        imagealphablending($cropped, false);
        imagesavealpha($cropped, true);
        $transparent = imagecolorallocatealpha($cropped, 0, 0, 0, 127);
        imagefill($cropped, 0, 0, $transparent);
        imagecopy($cropped, $image, 0, 0, $cropLeft, $cropTop, $cropWidth, $cropHeight);

        return $cropped;
    }

    private function encodePng(\GdImage $image): string
    {
        ob_start();
        $written = imagepng($image, null, 6);
        $png = ob_get_clean();

        if (! $written || ! is_string($png)) {
            throw new \RuntimeException('Unable to encode the trimmed PNG.');
        }

        return $png;
    }

    /** @param array<string, mixed> $entry */
    private function appendManifest(string $manifestPath, array $entry): void
    {
        file_put_contents($manifestPath, json_encode($entry, JSON_THROW_ON_ERROR).PHP_EOL, FILE_APPEND | LOCK_EX);
    }
}
