<?php

namespace App\Http\Requests\Users;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Institution;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()?->can('create', \App\Models\User::class) ?? false;
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
            'nic' => 'required|string|max:20|unique:users,nic',
            'mobile' => 'required|string|max:15|unique:users,mobile',
            'institution_id' => 'required|exists:institutions,id',
            'role'=> 'required|exists:roles,name',
            'districts' => 'nullable|array',
            'districts.*' => 'string|in:Galle,Matara,Hambantota',
        ];
    }

    public function messages(): array
    {
        return [
            'nic.unique' => 'A user with this National Identity Card (NIC) number already exists.',
            'mobile.unique' => 'A user with this contact number already exists.',
            'institution_id.exists' => 'The selected institution is invalid.',
            'role.exists' => 'The selected role is invalid.',
        ];
    }

    public function after(): array
    {
        return [function ($validator) {
            if ($this->input('role') === 'system_admin' && ! $this->user()?->hasRole('system_admin')) {
                $validator->errors()->add('role', 'Only system administrators can create another system administrator.');
                return;
            }

            $allowedInstitutionTypes = match ($this->input('role')) {
                'system_admin', 'chief_secretary', 'ministry_account_subject_officer' => ['MINISTRY'],
                'chief_accountant' => ['MINISTRY', 'PDHS'],
                'accountant' => ['RDHS', 'BASE_HOSPITAL'],
                default => null,
            };

            if (! $allowedInstitutionTypes) {
                return;
            }

            $institution = Institution::find($this->integer('institution_id'));

            if (! $institution || ! in_array($institution->type, $allowedInstitutionTypes, true)) {
                $roleName = match ($this->input('role')) {
                    'system_admin' => 'System Administrator',
                    'chief_accountant' => 'Chief Accountant',
                    'ministry_account_subject_officer' => 'Ministry Account Subject Officer',
                    'accountant' => 'Accountant',
                    default => 'Chief Secretary',
                };
                $institutionTypes = implode(' or ', $allowedInstitutionTypes);
                $validator->errors()->add('institution_id', "{$roleName} must be assigned to a {$institutionTypes} institution.");
            }
        }];
    }
}
