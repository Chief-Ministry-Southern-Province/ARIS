<?php

namespace Tests\Feature;

use App\Models\AccidentCase;
use App\Models\Institution;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\Notifications\NotificationService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery\MockInterface;
use Tests\TestCase;

class AccidentCaseReferenceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->mock(NotificationService::class, function (MockInterface $notifications): void {
            $notifications->shouldReceive('notifyNewAccidentReported')->zeroOrMoreTimes();
        });
        $this->seed(RoleSeeder::class);
    }

    public function test_reporting_an_accident_creates_a_case_with_the_same_pdhs_reference_and_increments_the_sequence(): void
    {
        $pdhs = Institution::factory()->create(['type' => 'PDHS']);
        $reporter = User::factory()->for($pdhs)->withRole('subject_officer')->create();
        $vehicle = $this->vehicleFor($pdhs, 'PDHS');
        $year = now()->year;

        $first = $this->reportAccident($reporter, $vehicle);
        $second = $this->reportAccident($reporter, $vehicle, ['location' => 'Matara Road']);

        $this->assertSame("CMSP/HLTH/PDHS/{$year}/0001", $first['reference_number']);
        $this->assertSame("CMSP/HLTH/PDHS/{$year}/0002", $second['reference_number']);

        foreach ([$first, $second] as $accident) {
            $case = AccidentCase::query()->where('accident_id', $accident['id'])->firstOrFail();

            $this->assertSame($accident['reference_number'], $case->case_number);
            $this->assertSame($pdhs->id, $case->institution_id);
            $this->assertSame($reporter->id, $case->created_by);
            $this->assertSame($reporter->id, $case->assigned_to);
            $this->assertSame('ACCIDENT_REPORTED', $case->current_stage);
            $this->assertSame('OPEN', $case->status);
            $this->assertDatabaseHas('case_histories', [
                'accident_case_id' => $case->id,
                'action' => 'CASE_CREATED',
            ]);
            $this->assertDatabaseHas('case_histories', [
                'accident_case_id' => $case->id,
                'action' => 'ACCIDENT_REPORTED',
            ]);
        }
    }

    public function test_base_hospital_uses_its_configured_location_code(): void
    {
        $pdhs = Institution::factory()->create(['type' => 'PDHS']);
        $hospital = Institution::factory()->create([
            'name' => 'Base Hospital Balapitiya',
            'type' => 'BASE_HOSPITAL',
            'parent_institution_id' => $pdhs->id,
        ]);
        $reporter = User::factory()->for($hospital)->withRole('subject_officer')->create();
        $vehicle = $this->vehicleFor($hospital, 'BH');

        $accident = $this->reportAccident($reporter, $vehicle);

        $this->assertSame('CMSP/HLTH/BH/BAL/'.now()->year.'/0001', $accident['reference_number']);
        $this->assertDatabaseHas('accident_cases', [
            'accident_id' => $accident['id'],
            'case_number' => $accident['reference_number'],
            'institution_id' => $hospital->id,
        ]);
    }

    public function test_accident_report_rejects_a_future_date_before_creating_an_accident_or_case(): void
    {
        $institution = Institution::factory()->create(['type' => 'PDHS']);
        $reporter = User::factory()->for($institution)->withRole('subject_officer')->create();
        $vehicle = $this->vehicleFor($institution, 'FUTURE');

        $this->fromStatefulSpa()->actingAs($reporter)
            ->postJson('/api/accidents', $this->validPayload($vehicle, [
                'accident_date' => now()->addDay()->toDateString(),
            ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('accident_date');

        $this->assertDatabaseCount('accidents', 0);
        $this->assertDatabaseCount('accident_cases', 0);
    }

    private function reportAccident(User $reporter, Vehicle $vehicle, array $overrides = []): array
    {
        $response = $this->fromStatefulSpa()->actingAs($reporter)
            ->postJson('/api/accidents', $this->validPayload($vehicle, $overrides))
            ->assertCreated()
            ->assertJsonPath('message', 'Accident reported successfully.');

        return $response->json('accident');
    }

    private function vehicleFor(Institution $institution, string $suffix): Vehicle
    {
        return Vehicle::create([
            'vehicle_number' => "SP-{$suffix}-1001",
            'vehicle_type' => 'VAN',
            'brand' => 'Test Brand',
            'model' => 'Test Model',
            'manufactured_year' => 2024,
            'engine_number' => "ENGINE-{$suffix}-1001",
            'chassis_number' => "CHASSIS-{$suffix}-1001",
            'insurance_number' => "INSURANCE-{$suffix}-1001",
            'insurance_expiry_date' => '2027-12-31',
            'registered_owner' => 'Southern Provincial Health Service',
            'fuel_type' => 'DIESEL',
            'institution_id' => $institution->id,
        ]);
    }

    private function validPayload(Vehicle $vehicle, array $overrides = []): array
    {
        return array_replace([
            'vehicle_id' => $vehicle->id,
            'accident_date' => now()->toDateString(),
            'accident_time' => '09:00',
            'severity' => 'MINOR',
            'province' => 'Southern',
            'district' => 'Galle',
            'location' => 'Galle Road',
            'injury_count' => 0,
            'fatality_count' => 0,
            'road_condition' => 'DRY',
            'weather_condition' => 'SUNNY',
        ], $overrides);
    }
}
