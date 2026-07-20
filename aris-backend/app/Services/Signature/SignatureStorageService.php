<?php

namespace App\Services\Signature;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SignatureStorageService
{
    /**
     * Store signature file.
     */
    public function store(User $user, UploadedFile $file): string
    {
        return $file->store(
            "signatures/{$user->id}",
            'private'
        );
    }

    /**
     * Delete signature file.
     */
    public function delete(string $path): void
    {
        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }
    }

    /**
     * Stream signature.
     */
    public function response(string $path): StreamedResponse
    {
        abort_unless(
            Storage::disk('private')->exists($path),
            404,
            'Signature not found.'
        );

        return Storage::disk('private')->response($path);
    }
}