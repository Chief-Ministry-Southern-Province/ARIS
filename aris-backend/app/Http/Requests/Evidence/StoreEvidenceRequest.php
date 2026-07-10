<?php

namespace App\Http\Requests\Evidence;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvidenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [

            'files' => [
                'required',
                'array',
                'min:1',
            ],

            'files.*' => [
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,pdf,doc,docx',
            ],

            'description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [

            'files.required' =>
                'Please select at least one file.',

            'files.*.mimes' =>
                'Only JPG, PNG, PDF, DOC and DOCX are allowed.',

            'files.*.max' =>
                'Each file must be less than 10MB.',
        ];
    }
}