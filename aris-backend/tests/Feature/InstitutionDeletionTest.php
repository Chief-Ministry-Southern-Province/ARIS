<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class InstitutionDeletionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $soGalle;
    protected User $soMatara;
    protected Institution $ministry;
    protected Institution $pdhs;
    protected Institution $rdhsGalle;
    protected Institution $rdhsMatara;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'system_admin']);
        Role::firstOrCreate(['name' => 'subject_officer']);

        $this->ministry = Institution::create([
            'name' => 'Southern Provincial Ministry of Health',
            'type' => 'MINISTRY',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => null,
        ]);

        $this->pdhs = Institution::create([
            'name' => 'PDHS Southern',
            'type' => 'PDHS',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->ministry->id,
        ]);

        $this->rdhsGalle = Institution::create([
            'name' => 'RDHS Galle',
            'type' => 'RDHS',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->pdhs->id,
        ]);

        $this->rdhsMatara = Institution::create([
            'name' => 'RDHS Matara',
            'type' => 'RDHS',
            'province' => 'Southern',
            'district' => 'Matara',
            'parent_institution_id' => $this->pdhs->id,
        ]);

        $this->admin = User::create([
            'name' => 'Admin User',
            'nic' => '198512345678',
            'mobile' => '0771234567',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $this->admin->assignRole('system_admin');

        $this->soGalle = User::create([
            'name' => 'SO Galle',
            'nic' => '199012345678',
            'mobile' => '0777654321',
            'institution_id' => $this->rdhsGalle->id,
            'password' => bcrypt('password123'),
        ]);
        $this->soGalle->assignRole('subject_officer');

        $this->soMatara = User::create([
            'name' => 'SO Matara',
            'nic' => '199112345678',
            'mobile' => '0777654322',
            'institution_id' => $this->rdhsMatara->id,
            'password' => bcrypt('password123'),
        ]);
        $this->soMatara->assignRole('subject_officer');
    }

    public function test_system_admin_can_delete_institution(): void
    {
        $hospital = Institution::create([
            'name' => 'Hospital Baddegama',
            'type' => 'DIVISIONAL_HOSPITAL',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->rdhsGalle->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/institutions/{$hospital->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('institutions', ['id' => $hospital->id]);
    }

    public function test_relevant_subject_officer_can_delete_subordinate_institution(): void
    {
        $hospital = Institution::create([
            'name' => 'Hospital Baddegama',
            'type' => 'DIVISIONAL_HOSPITAL',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->rdhsGalle->id,
        ]);

        $response = $this->actingAs($this->soGalle)
            ->deleteJson("/api/institutions/{$hospital->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('institutions', ['id' => $hospital->id]);
    }

    public function test_subject_officer_cannot_delete_their_own_institution(): void
    {
        $response = $this->actingAs($this->soGalle)
            ->deleteJson("/api/institutions/{$this->rdhsGalle->id}");

        $response->assertStatus(403);
    }

    public function test_subject_officer_cannot_delete_institution_under_different_institution(): void
    {
        $hospital = Institution::create([
            'name' => 'Hospital Akuressa',
            'type' => 'DIVISIONAL_HOSPITAL',
            'province' => 'Southern',
            'district' => 'Matara',
            'parent_institution_id' => $this->rdhsMatara->id,
        ]);

        $response = $this->actingAs($this->soGalle)
            ->deleteJson("/api/institutions/{$hospital->id}");

        $response->assertStatus(403);
    }

    public function test_cannot_delete_root_ministry(): void
    {
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/institutions/{$this->ministry->id}");

        $response->assertStatus(403);
    }

    public function test_cannot_delete_institution_with_child_institutions(): void
    {
        // $this->pdhs has $this->rdhsGalle as child
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/institutions/{$this->pdhs->id}");

        $response->assertStatus(422);
    }

    public function test_cannot_delete_institution_with_assigned_users(): void
    {
        $hospital = Institution::create([
            'name' => 'Hospital With Users',
            'type' => 'DIVISIONAL_HOSPITAL',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->rdhsGalle->id,
        ]);

        User::create([
            'name' => 'Doctor User',
            'nic' => '199812345678',
            'mobile' => '0770001111',
            'institution_id' => $hospital->id,
            'password' => bcrypt('password123'),
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/institutions/{$hospital->id}");

        $response->assertStatus(422);
    }

    public function test_cannot_delete_institution_with_registered_vehicles(): void
    {
        $hospital = Institution::create([
            'name' => 'Hospital With Vehicles',
            'type' => 'DIVISIONAL_HOSPITAL',
            'province' => 'Southern',
            'district' => 'Galle',
            'parent_institution_id' => $this->rdhsGalle->id,
        ]);

        Vehicle::create([
            'registration_number' => 'SP-CAB-1234',
            'type' => 'AMBULANCE',
            'make' => 'Toyota',
            'model' => 'HiAce',
            'year' => 2020,
            'institution_id' => $hospital->id,
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/institutions/{$hospital->id}");

        $response->assertStatus(422);
    }
}
