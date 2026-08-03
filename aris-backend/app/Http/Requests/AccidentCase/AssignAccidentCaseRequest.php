<?php

namespace App\Http\Requests\AccidentCase;

use Illuminate\Foundation\Http\FormRequest;

class AssignAccidentCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'assigned_to' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}
