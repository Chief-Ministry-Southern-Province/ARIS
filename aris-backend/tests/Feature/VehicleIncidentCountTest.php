<?php

namespace Tests\Feature;

use App\Models\Accident;
use App\Models\Institution;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class VehicleIncidentCountTest extends TestCase
{
    use RefreshDatabase;

    public function test_vehicle_list_returns_the_actual_number_of_linked_accidents(): void
    {
        Role::findOrCreate('system_admin', 'web');

        $institution = Institution::query()->create([
            'name' => 'Test Hospital',
            'type' => 'BASE_HOSPITAL',
        ]);
        $admin = User::query()->create([
            'name' => 'System Admin',
            'nic' => 'NIC123456789',
            'mobile' => '0712345678',
            'institution_id' => $institution->id,
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('system_admin');

        $vehicleWithAccidents = $this->vehicle($institution, 'WP-TEST-001');
        $vehicleWithoutAccidents = $this->vehicle($institution, 'WP-TEST-002');

        $this->accident($institution, $admin, $vehicleWithAccidents, 'ARIS/TEST/001');
        $this->accident($institution, $admin, $vehicleWithAccidents, 'ARIS/TEST/002');

        $this->fromStatefulSpa()->actingAs($admin)
            ->getJson('/api/vehicles')
            ->assertOk()
            ->assertJsonFragment([
                'id' => $vehicleWithAccidents->id,
                'accidents_count' => 2,
            ])
            ->assertJsonFragment([
                'id' => $vehicleWithoutAccidents->id,
                'accidents_count' => 0,
            ]);
    }

    private function vehicle(Institution $institution, string $number): Vehicle
    {
        return Vehicle::query()->create([
            'vehicle_number' => $number,
            'vehicle_type' => 'VAN',
            'brand' => 'Test Brand',
            'model' => 'Test Model',
            'manufactured_year' => 2020,
            'engine_number' => 'ENGINE-'.$number,
            'chassis_number' => 'CHASSIS-'.$number,
            'insurance_number' => 'INSURANCE-'.$number,
            'insurance_expiry_date' => now()->addYear()->toDateString(),
            'registered_owner' => 'Test Hospital',
            'fuel_type' => 'DIESEL',
            'institution_id' => $institution->id,
        ]);
    }

    private function fromStatefulSpa(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173')->withSession([]);
    }

    private function accident(Institution $institution, User $reporter, Vehicle $vehicle, string $referenceNumber): Accident
    {
        return Accident::query()->create([
            'reference_number' => $referenceNumber,
            'institution_id' => $institution->id,
            'reported_by' => $reporter->id,
            'vehicle_id' => $vehicle->id,
            'driver_id' => null,
            'accident_date' => now()->toDateString(),
            'accident_time' => '10:00:00',
            'severity' => 'MINOR',
            'province' => 'Southern',
            'district' => 'Galle',
            'location' => 'Test location',
            'road_condition' => 'DRY',
            'weather_condition' => 'SUNNY',
        ]);
    }
}
