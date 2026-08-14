<?php

namespace App\Http\Requests\FR109;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFR109ChiefSecretaryDecisionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'writeOffStatus' => ['required', Rule::in(['AUTHORISED', 'NOT_APPROVED'])],
        ];
    }
}
