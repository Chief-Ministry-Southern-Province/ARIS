<?php

namespace App\Http\Requests\AccidentCase;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAccidentCaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'priority' => [
                'nullable',
                'in:LOW,MEDIUM,HIGH,URGENT',
            ],
        ];
    }
}
