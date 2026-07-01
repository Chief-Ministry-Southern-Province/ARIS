<?php

namespace App\Http\Requests\Institution;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInstitutionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:MINISTRY,PDHS,RDHS,BASE_HOSPITAL,DIVISIONAL_HOSPITAL,MOH,PMCU,UNITS',
            'address' => 'nullable|string|max:255',
            'contact_number' => 'nullable|string|max:20',
            'district' => 'nullable|string|max:255',
            'province' => 'nullable|string|max:255',
            'head_of_institution' => 'nullable|string|max:255',
            'parent_institution_id' => 'nullable|exists:institutions,id',
            'direct_to_rdhs' => 'boolean',
        ];
    }
}
