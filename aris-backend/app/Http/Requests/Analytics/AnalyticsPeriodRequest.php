<?php

namespace App\Http\Requests\Analytics;

use Illuminate\Foundation\Http\FormRequest;

class AnalyticsPeriodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'period' => [
                'nullable',
                'string',
                'regex:/^FY\d{4}-\d{2}$/',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if ($value === null) {
                        return;
                    }

                    $startYear = (int) substr($value, 2, 4);
                    $endYear = (int) substr($value, 7, 2);

                    if ($endYear !== (($startYear + 1) % 100)) {
                        $fail('The selected fiscal period is invalid.');
                    }
                },
            ],
        ];
    }
}
