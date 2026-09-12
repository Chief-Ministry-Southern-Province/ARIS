<?php

namespace App\Http\Requests;

use App\Models\Backup;
use Illuminate\Foundation\Http\FormRequest;

class CreateBackupRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->can('create', Backup::class) ?? false; }
    public function rules(): array { return []; }
}
