<?php

namespace App\Http\Requests\Accident;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAccidentRequest extends FormRequest
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

            'vehicle_id' => [
                'required',
                'exists:vehicles,id',
            ],

            'driver_id' => [
                'nullable',
                'exists:users,id',
            ],

            'accident_date' => [
                'required',
                'date',
                'before_or_equal:today',
            ],

            'accident_time' => [
                'required',
                'date_format:H:i',
            ],

            'severity' => [
                'required',
                Rule::in([
                    'MINOR',
                    'MAJOR',
                    'FATAL',
                ]),
            ],

            'province' => [
                'required',
                'string',
                'max:255',
            ],

            'district' => [
                'required',
                'string',
                'max:255',
            ],

            'location' => [
                'required',
                'string',
                'max:500',
            ],

            'latitude' => [
                'nullable',
                'numeric',
                'between:-90,90',
            ],

            'longitude' => [
                'nullable',
                'numeric',
                'between:-180,180',
            ],

            'injury_count' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'fatality_count' => [
                'nullable',
                'integer',
                'min:0',
            ],

            'road_condition' => [
                'required',
                Rule::in([
                    'DRY',
                    'WET',
                    'FLOODED',
                    'GRAVEL',
                    'UNDER_CONSTRUCTION',
                    'OTHER',
                ]),
            ],

            'weather_condition' => [
                'required',
                Rule::in([
                    'SUNNY',
                    'RAINY',
                    'CLOUDY',
                    'FOGGY',
                    'WINDY',
                    'OTHER',
                ]),
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'vehicle_damage' => [
                'nullable',
                'string',
            ],

            'has_travel_permission' => [
                'nullable',
                'boolean',
            ],

            'files' => [
                'nullable',
                'array',
            ],

            'files.*' => [
                'file',
                'max:10240',
                'mimes:jpg,jpeg,png,pdf,doc,docx',
            ],

            'evidence_description' => [
                'nullable',
                'string',
                'max:500',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'vehicle_id.required' => 'Please select a vehicle.',
            'vehicle_id.exists' => 'The selected vehicle does not exist.',
            'driver_id.exists' => 'The selected driver does not exist.',
            'accident_date.before_or_equal' => 'Accident date cannot be in the future.',
            'accident_time.date_format' => 'Please enter a valid time in HH:MM format.',
        ];
    }

    public function attributes(): array
    {
        return [
            'vehicle_id' => 'Vehicle',
            'driver_id' => 'Driver',
            'accident_date' => 'Accident Date',
            'accident_time' => 'Accident Time',
            'severity' => 'Severity',
            'province' => 'Province',
            'district' => 'District',
            'location' => 'Location',
            'latitude' => 'Latitude',
            'longitude' => 'Longitude',
            'injury_count' => 'Injury Count',
            'fatality_count' => 'Fatality Count',
            'road_condition' => 'Road Condition',
            'weather_condition' => 'Weather Condition',
        ];
    }
}
