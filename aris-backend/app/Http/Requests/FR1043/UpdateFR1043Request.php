<?php

namespace App\Http\Requests\FR1043;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateFR1043Request extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'status' => [
                'required',
                'in:DRAFT,CHANGES_REQUESTED'
            ],

            'data' => [
                'required',
                'array',
            ],

            'data.department' => [
                'required',
                'string',
                'max:255'
            ],

            'data.date' => [
                'required',
                'date'
            ],

            'data.place' => [
                'required',
                'string',
                'max:255'
            ],

            'data.loss' => [
                'nullable',
                'string'
            ],

            'data.natureOfLoss' => [
                'nullable',
                'string'
            ],

            'data.causeOfLoss' => [
                'nullable',
                'string'
            ],

            'data.policeStation' => [
                'nullable',
                'string'
            ],

            'data.policeReportDate' => [
                'nullable',
                'date'
            ],

            'data.investigation' => [
                'nullable',
                'string'
            ],

            'data.securityArrangements' => [
                'nullable',
                'string'
            ],

            'data.preventionArrangements' => [
                'nullable',
                'string'
            ],

            'data.items' => [
                'array'
            ],

            'data.officers' => [
                'array'
            ],

        ];
    }
}
