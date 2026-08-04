<?php

namespace App\Http\Requests\FR109;

use Illuminate\Foundation\Http\FormRequest;

class SaveFR109Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'data' => ['required', 'array'],
            'data.netLoss' => ['nullable', 'numeric', 'min:0'],
            'data.originalCost' => ['nullable', 'numeric', 'min:0'],
            'data.writeOffEntries' => ['nullable', 'array'],
            'data.writeOffEntries.*.stockBookFolio' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries.*.inventoryBookFolio' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries.*.fixedAssetsRegisterFolio' => ['nullable', 'string', 'max:255'],
            'data.writeOffEntries.*.ledgerFolio' => ['nullable', 'string', 'max:255'],
        ];
    }
}
