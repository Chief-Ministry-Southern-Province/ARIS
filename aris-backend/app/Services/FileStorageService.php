<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileStorageService
{
    /**
     * Store a file.
     */
    public function store(
        UploadedFile $file,
        string $directory,
        string $disk = 'public'
    ): array {

        $path = $file->store($directory, $disk);

        return [

            'original_name' => $file->getClientOriginalName(),

            'file_name' => basename($path),

            'file_path' => $path,

            'mime_type' => $file->getMimeType(),

            'file_size' => $file->getSize(),

        ];
    }

    /**
     * Delete a file.
     */
    public function delete(
        string $path,
        string $disk = 'public'
    ): bool {

        if (Storage::disk($disk)->exists($path)) {

            return Storage::disk($disk)->delete($path);

        }

        return false;
    }

    /**
     * Download a file.
     */
    public function download(
        string $path,
        string $originalName,
        string $disk = 'public'
    ) {
        return Storage::disk($disk)
            ->download($path, $originalName);
    }

    /**
     * Check file exists.
     */
    public function exists(
        string $path,
        string $disk = 'public'
    ): bool {

        return Storage::disk($disk)
            ->exists($path);
    }

    /**
     * Get public URL.
     */
    public function url(
        string $path,
        string $disk = 'public'
    ): string {

        return Storage::disk($disk)
            ->url($path);
    }
}

/**
 * If you migrate to Amazon S3, change all instances of:
  *Storage::disk('public')
  *to
  *Storage::disk('s3')
 */