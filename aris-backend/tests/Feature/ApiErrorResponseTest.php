<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ApiErrorResponseTest extends TestCase
{
    public function test_production_api_errors_do_not_expose_exception_details(): void
    {
        config()->set('app.debug', false);

        Route::get('/api/testing/friendly-server-error', function (): void {
            throw new \RuntimeException('Sensitive database connection details');
        });

        $this->getJson('/api/testing/friendly-server-error')
            ->assertStatus(500)
            ->assertExactJson([
                'message' => 'Something went wrong on our side. Please try again later.',
            ]);
    }

    public function test_production_validation_errors_keep_field_keys_with_a_friendly_summary(): void
    {
        config()->set('app.debug', false);

        Route::post('/api/testing/friendly-validation-error', function (): void {
            throw ValidationException::withMessages([
                'reference_number' => ['The reference number is required.'],
            ]);
        });

        $this->postJson('/api/testing/friendly-validation-error')
            ->assertUnprocessable()
            ->assertJsonPath('message', 'Please correct the highlighted fields and try again.')
            ->assertJsonPath('errors.reference_number.0', 'The reference number is required.');
    }
}
