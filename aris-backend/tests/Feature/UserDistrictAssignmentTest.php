<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserDistrictAssignmentTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;

    protected $ministry;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles
        Role::create(['name' => 'system_admin']);
        Role::create(['name' => 'subject_officer']);

        // Create institution
        $this->ministry = Institution::create([
            'name' => 'Ministry of Health',
            'type' => 'MINISTRY',
            'province' => 'Southern',
            'district' => 'Galle',
        ]);

        // Create standard system admin to act as the authenticated user for these tests
        $this->admin = User::create([
            'name' => 'Admin User',
            'nic' => '123456789V',
            'mobile' => '0771234567',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $this->admin->assignRole('system_admin');
    }

    public function test_can_create_subject_officer_with_districts(): void
    {
        $payload = [
            'name' => 'SO User',
            'nic' => '200012345678',
            'mobile' => '0777123456',
            'institution_id' => $this->ministry->id,
            'role' => 'subject_officer',
            'password' => 'password123',
            'districts' => ['Galle', 'Matara'],
        ];

        $response = $this->fromStatefulSpa()->actingAs($this->admin)
            ->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('name', 'SO User')
            ->assertJsonCount(2, 'districts');

        $this->assertDatabaseHas('subject_officer_districts', [
            'district' => 'Galle',
        ]);
        $this->assertDatabaseHas('subject_officer_districts', [
            'district' => 'Matara',
        ]);
    }

    public function test_can_update_subject_officer_districts(): void
    {
        $user = User::create([
            'name' => 'SO User',
            'nic' => '200012345678',
            'mobile' => '0777123456',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $user->assignRole('subject_officer');
        $user->districts()->create(['district' => 'Galle']);
        $user->districts()->create(['district' => 'Matara']);

        $payload = [
            'name' => 'SO User Updated',
            'nic' => $user->nic,
            'mobile' => '0777123456',
            'institution_id' => $this->ministry->id,
            'role' => 'subject_officer',
            'districts' => ['Matara', 'Hambantota'],
        ];

        $response = $this->fromStatefulSpa()->actingAs($this->admin)
            ->putJson("/api/users/{$user->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonCount(2, 'districts');

        $this->assertDatabaseMissing('subject_officer_districts', [
            'user_id' => $user->id,
            'district' => 'Galle',
        ]);
        $this->assertDatabaseHas('subject_officer_districts', [
            'user_id' => $user->id,
            'district' => 'Matara',
        ]);
        $this->assertDatabaseHas('subject_officer_districts', [
            'user_id' => $user->id,
            'district' => 'Hambantota',
        ]);
    }

    public function test_fails_validation_for_invalid_districts(): void
    {
        $payload = [
            'name' => 'SO User',
            'nic' => '200012345678',
            'mobile' => '0777123456',
            'institution_id' => $this->ministry->id,
            'role' => 'subject_officer',
            'password' => 'password123',
            'districts' => ['Colombo'], // Invalid district
        ];

        $response = $this->fromStatefulSpa()->actingAs($this->admin)
            ->postJson('/api/users', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors('districts.0');
    }
}
