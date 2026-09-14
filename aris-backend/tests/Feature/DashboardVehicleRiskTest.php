<?php

namespace Tests\Feature;

use App\Models\Accident;
use App\Models\Institution;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\DashboardService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DashboardVehicleRiskTest extends TestCase
{
    use RefreshDatabase;

    public function test_vehicle_risk_is_the_percentage_of_the_fleet_with_an_incident(): void
    {
        Role::findOrCreate('system_admin', 'web');
        $institution = Institution::query()->create(['name' => 'Test Hospital', 'type' => 'BASE_HOSPITAL']);
        $admin = User::query()->create([
            'name' => 'System Admin',
            'nic' => 'NIC123456789',
            'mobile' => '0712345678',
            'institution_id' => $institution->id,
            'password' => bcrypt('password'),
        ]);
        $admin->assignRole('system_admin');

        $carOne = $this->vehicle($institution, 'WP-CAR-001', 'CAR');
        $this->vehicle($institution, 'WP-CAR-002', 'CAR');
        $vanOne = $this->vehicle($institution, 'WP-VAN-001', 'VAN');
        $vanTwo = $this->vehicle($institution, 'WP-VAN-002', 'VAN');

        $this->accident($institution, $admin, $carOne, 'ARIS/TEST/CAR/001');
        $this->accident($institution, $admin, $carOne, 'ARIS/TEST/CAR/002');
        $this->accident($institution, $admin, $vanOne, 'ARIS/TEST/VAN/001');
        $this->accident($institution, $admin, $vanTwo, 'ARIS/TEST/VAN/002');

        $risks = collect(app(DashboardService::class)->statisticsFor($admin)['vehicle_risks'])->keyBy('vehicle');

        $this->assertSame([
            'vehicle' => 'Car',
            'incidents' => 2,
            'affected_vehicles' => 1,
            'fleet_size' => 2,
            'risk' => 50,
        ], $risks->get('Car'));
        $this->assertSame(100, $risks->get('Van')['risk']);
    }

    private function vehicle(Institution $institution, string $number, string $type): Vehicle
    {
        return Vehicle::query()->create([
            'vehicle_number' => $number,
            'vehicle_type' => $type,
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

    private function accident(Institution $institution, User $reporter, Vehicle $vehicle, string $referenceNumber): Accident
    {
        return Accident::query()->create([
            'reference_number' => $referenceNumber,
            'institution_id' => $institution->id,
            'reported_by' => $reporter->id,
            'vehicle_id' => $vehicle->id,
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
