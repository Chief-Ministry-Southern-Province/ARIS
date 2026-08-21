<?php

namespace App\Http\Requests\FR109;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFR109ChiefAccountingOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'chiefAccountingOfficerSTNo' => ['required', 'string', 'max:255'],
        ];
    }
}
