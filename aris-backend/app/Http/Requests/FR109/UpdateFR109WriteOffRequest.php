<?php

namespace App\Http\Requests\FR109;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFR109WriteOffRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'writeOffEntries' => ['required', 'array', 'min:1'],
            'writeOffEntries.*.stockBookFolio' => ['nullable', 'string', 'max:255'],
            'writeOffEntries.*.inventoryBookFolio' => ['nullable', 'string', 'max:255'],
            'writeOffEntries.*.fixedAssetsRegisterFolio' => ['nullable', 'string', 'max:255'],
            'writeOffEntries.*.ledgerFolio' => ['nullable', 'string', 'max:255'],
        ];
    }
}
