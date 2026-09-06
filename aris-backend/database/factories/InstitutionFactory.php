<?php

namespace Database\Factories;

use App\Models\Institution;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Institution>
 */
class InstitutionFactory extends Factory
{
    protected $model = Institution::class;

    public function definition(): array
    {
        return [
            'name' => fake()->unique()->company().' Hospital',
            'type' => 'BASE_HOSPITAL',
            'address' => fake()->address(),
            'contact_number' => '0'.fake()->numerify('7########'),
            'district' => 'Galle',
            'province' => 'Southern',
            'head_of_institution' => fake()->name(),
            'direct_to_rdhs' => false,
        ];
    }

    public function ministry(): static
    {
        return $this->state(fn (): array => ['type' => 'MINISTRY']);
    }
}
