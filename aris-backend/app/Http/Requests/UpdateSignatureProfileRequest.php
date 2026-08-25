<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSignatureProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'display_name' => ['required', 'string', 'max:100'],
            'designation' => ['nullable', 'string', 'max:150'],
            'institution_name' => ['nullable', 'string', 'max:150'],
            'institution_lines' => ['nullable', 'array', 'max:4'],
            'institution_lines.*' => ['nullable', 'string', 'max:100'],
        ];
    }
}
