<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreVehicleRequest extends FormRequest
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
            'vehicle_number' => [
                'required',
                'string',
                'max:20',
                'unique:vehicles,vehicle_number',
            ],

            'registered_date' => [
                'nullable',
                'date',
                'before_or_equal:today',
            ],

            'vehicle_type' => [
                'required',
                Rule::in([
                    'CAR',
                    'VAN',
                    'BUS',
                    'TRUCK',
                    'MOTORCYCLE',
                    'CAB',
                    'THREE_WHEELER',
                    'BOWSER',
                    'AMBULANCE',
                    'OTHER',
                ]),
            ],
            'brand' => [
                'required',
                'string',
                'max:100',
            ],

            'model' => [
                'required',
                'string',
                'max:100',
            ],

            'manufactured_year' => [
                'required',
                'digits:4',
                'integer',
                'min:1950',
                'max:' . date('Y'),
            ],

            'engine_number' => [
                'required',
                'string',
                'max:100',
                'unique:vehicles,engine_number',
            ],

            'chassis_number' => [
                'required',
                'string',
                'max:100',
                'unique:vehicles,chassis_number',
            ],

            'insurance_number' => [
                'required',
                'string',
                'max:100',
                'unique:vehicles,insurance_number',
            ],

            'insurance_expiry_date' => [
                'required',
                'date',
                'after:today',
            ],

            'value' => [
                'nullable',
                'numeric',
                'min:0',
            ],

            'registered_owner' => [
                'required',
                'string',
                'max:255',
            ],

            'fuel_type' => [
                'required',
                Rule::in([
                    'PETROL',
                    'DIESEL',
                    'HYBRID',
                    'ELECTRIC',
                ]),
            ],

            'status' => [
                'sometimes',
                Rule::in([
                    'ACTIVE',
                    'UNDER_MAINTENANCE',
                    'OUT_OF_SERVICE',
                    'DISPOSED',
                ]),
            ],

            'institution_id' => [
                'nullable',
                'exists:institutions,id',
            ],

            'driver_id' => [
                'nullable',
                'exists:users,id',
            ],

        ];
    }

     public function messages(): array
    {
        return [
            'vehicle_number.unique' =>
                'This registration number already exists.',

            'engine_number.unique' =>
                'This engine number already exists.',

            'chassis_number.unique' =>
                'This chassis number already exists.',

            'insurance_expiry_date.after' =>
                'Insurance expiry date must be a future date.',
        ];
    }

    public function attributes(): array
    {
        return [
            'vehicle_number' => 'Vehicle Number',
            'registered_date' => 'Registered Date',
            'vehicle_type' => 'Vehicle Type',
            'brand' => 'Brand',
            'model' => 'Model',
            'manufactured_year' => 'Manufactured Year',
            'engine_number' => 'Engine Number',
            'chassis_number' => 'Chassis Number',
            'insurance_number' => 'Insurance Number',
            'insurance_expiry_date' => 'Insurance Expiry Date',
            'value' => 'Value',
            'registered_owner' => 'Registered Owner',
            'fuel_type' => 'Fuel Type',
            'status' => 'Status',
            'institution_id' => 'Institution ID',
        ];
    }
}
