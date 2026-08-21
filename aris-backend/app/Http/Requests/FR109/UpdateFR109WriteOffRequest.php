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
            'writeOffEntries.*.stockBookFolio' => ['required', 'string', 'max:255'],
            'writeOffEntries.*.inventoryBookFolio' => ['required', 'string', 'max:255'],
            'writeOffEntries.*.fixedAssetsRegisterFolio' => ['required', 'string', 'max:255'],
            'writeOffEntries.*.ledgerFolio' => ['required', 'string', 'max:255'],
        ];
    }
}
