<?php

namespace App\Http\Requests\FR1044;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFR1044AttachmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,pdf,doc,docx'],
            'field_key' => ['required', Rule::in(['policeReportFile', 'courtOrderFile', 'boardReportFile'])],
            'description' => ['nullable', 'string', 'max:500'],
        ];
    }
}
