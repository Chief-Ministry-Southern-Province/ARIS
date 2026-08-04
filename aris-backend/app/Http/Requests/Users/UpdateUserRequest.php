<?php

namespace App\Http\Requests\Users;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Institution;

class UpdateUserRequest extends FormRequest
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
        return  [
            'name' => 'required|string|max:255',
            'nic' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'nic')->ignore($this->route('user')),
            ],
            'mobile' => 'required|string|max:15',
            'institution_id' => 'required|exists:institutions,id',
            'role'=> 'required|exists:roles,name',
            'districts' => 'nullable|array',
            'districts.*' => 'string|in:Galle,Matara,Hambantota',
        ];
    }

    public function after(): array
    {
        return [function ($validator) {
            $requiredInstitutionType = match ($this->input('role')) {
                'chief_secretary' => 'MINISTRY',
                'chief_accountant' => 'PDHS',
                default => null,
            };

            if (! $requiredInstitutionType) {
                return;
            }

            $institution = Institution::find($this->integer('institution_id'));

            if (! $institution || $institution->type !== $requiredInstitutionType) {
                $roleName = $this->input('role') === 'chief_accountant' ? 'Chief Accountant' : 'Chief Secretary';
                $validator->errors()->add('institution_id', "{$roleName} must be assigned to a {$requiredInstitutionType} institution.");
            }
        }];
    }
}
