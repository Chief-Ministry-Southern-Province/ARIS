<?php

namespace App\Http\Requests;

use App\Models\Backup;
use Illuminate\Foundation\Http\FormRequest;

class RestoreBackupRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('restore', $this->route('backup')) ?? false; }
    public function rules(): array { return ['confirmation' => ['required', 'in:RESTORE']]; }
}
