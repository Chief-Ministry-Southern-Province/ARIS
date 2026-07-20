<?php

namespace App\Services\Signature;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SignatureStorageService
{
    public function store(User $user, UploadedFile $file): string
    {
        return $file->store(
            "signatures/{$user->id}",
            'private'
        );
    }

    public function delete(string $path): void
    {
        if (Storage::disk('private')->exists($path)) {
            Storage::disk('private')->delete($path);
        }
    }

    public function response(string $path): StreamedResponse
    {
        abort_unless(
            Storage::disk('private')->exists($path),
            404
        );

        return Storage::disk('private')->response($path);
    }
}