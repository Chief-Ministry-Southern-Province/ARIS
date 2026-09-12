<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadBackupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('system_admin') || $this->user()?->can('backup.restore');
    }

    public function rules(): array
    {
        return [
            'backup' => ['required', 'file', 'mimes:zip', 'max:'.config('backups.upload_max_kb')],
        ];
    }
}
