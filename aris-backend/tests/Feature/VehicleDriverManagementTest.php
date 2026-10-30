<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Accident;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class VehicleDriverManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $subjectOfficer;
    protected User $driver1;
    protected User $driver2;
    protected Institution $ministry;
    protected Institution $rdhs;
    protected Vehicle $vehicle1;
    protected Vehicle $vehicle2;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'system_admin']);
        Role::firstOrCreate(['name' => 'subject_officer']);
        Role::firstOrCreate(['name' => 'driver']);

        $this->ministry = Institution::create([
            'name' => 'Southern Provincial Ministry of Health',
            'type' => 'MINISTRY',
            'province' => 'Southern',
            'district' => 'Galle',
        ]);

        $this->rdhs = Institution::create([
            'name' => 'RDHS Galle',
            'type' => 'RDHS',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->ministry->id,
        ]);

        $this->admin = User::create([
            'name' => 'Sys Admin',
            'nic' => '198012345678',
            'mobile' => '0771111111',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('secret'),
        ]);
        $this->admin->assignRole('system_admin');

        $this->subjectOfficer = User::create([
            'name' => 'SO RDHS',
            'nic' => '198512345678',
            'mobile' => '0772222222',
            'institution_id' => $this->rdhs->id,
            'password' => bcrypt('secret'),
        ]);
        $this->subjectOfficer->assignRole('subject_officer');

        $this->driver1 = User::create([
            'name' => 'Driver One',
            'nic' => '199012345678',
            'mobile' => '0773333333',
            'institution_id' => $this->rdhs->id,
            'password' => bcrypt('secret'),
        ]);
        $this->driver1->assignRole('driver');

        $this->driver2 = User::create([
            'name' => 'Driver Two',
            'nic' => '199212345678',
            'mobile' => '0774444444',
            'institution_id' => $this->rdhs->id,
            'password' => bcrypt('secret'),
        ]);
        $this->driver2->assignRole('driver');

        $this->vehicle1 = Vehicle::create([
            'vehicle_number' => 'SP-CAB-1111',
            'vehicle_type' => 'AMBULANCE',
            'brand' => 'Toyota',
            'model' => 'HiAce',
            'manufactured_year' => 2021,
            'engine_number' => 'ENG-1111',
            'chassis_number' => 'CHS-1111',
            'insurance_number' => 'INS-1111',
            'insurance_expiry_date' => now()->addYear()->toDateString(),
            'registered_owner' => 'Ministry of Health',
            'fuel_type' => 'DIESEL',
            'institution_id' => $this->rdhs->id,
        ]);

        $this->vehicle2 = Vehicle::create([
            'vehicle_number' => 'SP-CAB-2222',
            'vehicle_type' => 'VAN',
            'brand' => 'Nissan',
            'model' => 'Caravan',
            'manufactured_year' => 2022,
            'engine_number' => 'ENG-2222',
            'chassis_number' => 'CHS-2222',
            'insurance_number' => 'INS-2222',
            'insurance_expiry_date' => now()->addYear()->toDateString(),
            'registered_owner' => 'Ministry of Health',
            'fuel_type' => 'DIESEL',
            'institution_id' => $this->rdhs->id,
        ]);
    }

    public function test_can_assign_multiple_drivers_and_activate_one(): void
    {
        $response = $this->actingAs($this->subjectOfficer)
            ->postJson("/api/vehicles/{$this->vehicle1->id}/drivers", [
                'driver_ids' => [$this->driver1->id, $this->driver2->id],
                'active_driver_id' => $this->driver1->id,
            ]);

        $response->assertStatus(200);

        $this->vehicle1->refresh();
        $this->assertEquals($this->driver1->id, $this->vehicle1->driver_id);
        $this->assertCount(2, $this->vehicle1->drivers);

        $pivot1 = $this->vehicle1->drivers()->where('driver_id', $this->driver1->id)->first()->pivot;
        $pivot2 = $this->vehicle1->drivers()->where('driver_id', $this->driver2->id)->first()->pivot;

        $this->assertTrue((bool) $pivot1->is_active);
        $this->assertFalse((bool) $pivot2->is_active);
    }

    public function test_can_switch_active_driver(): void
    {
        $this->vehicle1->syncDrivers([$this->driver1->id, $this->driver2->id], $this->driver1->id);

        $response = $this->actingAs($this->subjectOfficer)
            ->postJson("/api/vehicles/{$this->vehicle1->id}/activate-driver", [
                'driver_id' => $this->driver2->id,
            ]);

        $response->assertStatus(200);

        $this->vehicle1->refresh();
        $this->assertEquals($this->driver2->id, $this->vehicle1->driver_id);

        $pivot1 = $this->vehicle1->drivers()->where('driver_id', $this->driver1->id)->first()->pivot;
        $pivot2 = $this->vehicle1->drivers()->where('driver_id', $this->driver2->id)->first()->pivot;

        $this->assertFalse((bool) $pivot1->is_active);
        $this->assertTrue((bool) $pivot2->is_active);
    }

    public function test_driver_can_only_be_active_on_one_vehicle_at_a_time(): void
    {
        // Driver 1 is active on Vehicle 1
        $this->vehicle1->syncDrivers([$this->driver1->id], $this->driver1->id);
        $this->assertEquals($this->driver1->id, $this->vehicle1->fresh()->driver_id);

        // Now activate Driver 1 on Vehicle 2
        $this->actingAs($this->admin)
            ->postJson("/api/vehicles/{$this->vehicle2->id}/activate-driver", [
                'driver_id' => $this->driver1->id,
            ])
            ->assertStatus(200);

        // Driver 1 should be active on Vehicle 2
        $this->assertEquals($this->driver1->id, $this->vehicle2->fresh()->driver_id);

        // Vehicle 1 should have Driver 1 deactivated and driver_id set to null
        $this->assertNull($this->vehicle1->fresh()->driver_id);
        $pivotOnV1 = $this->vehicle1->drivers()->where('driver_id', $this->driver1->id)->first()->pivot;
        $this->assertFalse((bool) $pivotOnV1->is_active);
    }

    public function test_driver_index_only_lists_active_vehicle(): void
    {
        // Driver 1 is assigned to both vehicles, but active ONLY on Vehicle 1
        $this->vehicle1->syncDrivers([$this->driver1->id], $this->driver1->id);
        $this->vehicle2->syncDrivers([$this->driver1->id], null);

        $response = $this->actingAs($this->driver1)
            ->getJson('/api/vehicles');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertCount(1, $data);
        $this->assertEquals($this->vehicle1->id, $data[0]['id']);
    }

    public function test_active_driver_can_report_accident(): void
    {
        $this->vehicle1->syncDrivers([$this->driver1->id], $this->driver1->id);

        $payload = [
            'vehicle_id' => $this->vehicle1->id,
            'accident_date' => now()->toDateString(),
            'accident_time' => '10:30',
            'severity' => 'MINOR',
            'province' => 'Southern',
            'district' => 'Galle',
            'location' => 'Main Street Galle',
            'road_condition' => 'DRY',
            'weather_condition' => 'SUNNY',
        ];

        $response = $this->actingAs($this->driver1)
            ->postJson('/api/accidents', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('accidents', [
            'vehicle_id' => $this->vehicle1->id,
            'driver_id' => $this->driver1->id,
            'reported_by' => $this->driver1->id,
        ]);
    }

    public function test_inactive_driver_cannot_report_accident_for_vehicle(): void
    {
        // Driver 1 is assigned to Vehicle 1, but NOT active (driver_id is null)
        $this->vehicle1->syncDrivers([$this->driver1->id], null);

        $payload = [
            'vehicle_id' => $this->vehicle1->id,
            'accident_date' => now()->toDateString(),
            'accident_time' => '10:30',
            'severity' => 'MINOR',
            'province' => 'Southern',
            'district' => 'Galle',
            'location' => 'Main Street Galle',
            'road_condition' => 'DRY',
            'weather_condition' => 'SUNNY',
        ];

        $response = $this->actingAs($this->driver1)
            ->postJson('/api/accidents', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['vehicle_id']);
    }
}
