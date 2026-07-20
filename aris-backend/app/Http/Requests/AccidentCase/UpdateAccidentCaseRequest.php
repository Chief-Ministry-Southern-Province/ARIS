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

            'assigned_to' => [
                'nullable',
                'exists:users,id'
            ],

            'status' => [
                'nullable',
                'in:OPEN,IN_PROGRESS,ON_HOLD,COMPLETED,CLOSED'
            ],

            'priority' => [
                'nullable',
                'in:LOW,MEDIUM,HIGH,URGENT'
            ],

            'current_stage' => [
                'nullable',
                'in:ACCIDENT_REPORTED,FR1043,FR1044,FR109,CLOSED'
            ],
        ];
    }
}