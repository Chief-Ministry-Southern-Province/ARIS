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
            'nic' => 'required|string|max:20|unique:users',
            'mobile' => 'required|string|max:15',
            'institution_id' => 'required|exists:institutions,id',
            'role'=> 'required|exists:roles,name',
            'password' => 'required|string|min:8',
            'districts' => 'nullable|array',
            'districts.*' => 'string|in:Galle,Matara,Hambantota',
        ];
    }

    public function after(): array
    {
        return [function ($validator) {
            if ($this->input('role') !== 'treasury_secretary') {
                return;
            }

            $institution = Institution::find($this->integer('institution_id'));

            if (! $institution || $institution->type !== 'MINISTRY') {
                $validator->errors()->add('institution_id', 'Treasury Secretary must be assigned to a Ministry institution.');
            }
        }];
    }
}
