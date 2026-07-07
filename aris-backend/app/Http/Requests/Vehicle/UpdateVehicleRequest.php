<?php

namespace App\Http\Requests\Vehicle;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateVehicleRequest extends FormRequest
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
        $vehicle = $this->route('vehicle');

        return [

            'vehicle_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique('vehicles', 'vehicle_number')->ignore($vehicle),
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
                Rule::unique('vehicles', 'engine_number')->ignore($vehicle),
            ],

            'chassis_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('vehicles', 'chassis_number')->ignore($vehicle),
            ],

            'insurance_number' => [
                'required',
                'string',
                'max:100',
                Rule::unique('vehicles', 'insurance_number')->ignore($vehicle),
            ],

            'insurance_expiry_date' => [
                'required',
                'date',
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
                'required',
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

        ];
    }
}
