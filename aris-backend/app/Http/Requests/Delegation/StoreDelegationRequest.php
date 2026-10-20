<?php

namespace App\Http\Requests\Delegation;

use Illuminate\Foundation\Http\FormRequest;

class StoreDelegationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasAnyRole([
            'system_admin',
            'institution_admin',
            'secretary',
            'chief_secretary',
            'subject_officer',
        ]);
    }

    public function rules(): array
    {
        return [
            'institution_id' => ['nullable', 'integer', 'exists:institutions,id'],
            'officer_id' => ['required', 'integer', 'exists:users,id'],
            'acting_officer_id' => ['required', 'integer', 'exists:users,id', 'different:officer_id'],
            'role' => ['required', 'string', 'exists:roles,name'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'reason' => ['required', 'string', 'in:SICK_LEAVE,DUTY_LEAVE,VACATION,RESIGNATION,OTHER'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $user = $this->user();
            if ($user && ! $user->isSystemAdmin()) {
                $accessibleIds = app(\App\Services\InstitutionService::class)->accessibleInstitutionIds($user);
                $targetOfficer = \App\Models\User::find($this->input('officer_id'));

                if ($targetOfficer && ! in_array($targetOfficer->institution_id, $accessibleIds, true)) {
                    $validator->errors()->add('officer_id', 'You are not authorized to appoint delegations for this officer.');
                }
            }
        });
    }
}
