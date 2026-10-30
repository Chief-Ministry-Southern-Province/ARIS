<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SystemAdminManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $subjectOfficer;
    protected Institution $ministry;
    protected Institution $rdhs;

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
        ]);

        $this->rdhs = Institution::create([
            'name' => 'RDHS Galle',
            'type' => 'RDHS',
            'province' => 'Southern',
            'district' => 'Galle',
        ]);

        $this->admin = User::create([
            'name' => 'Main Admin',
            'nic' => '198512345678',
            'mobile' => '0771234567',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $this->admin->assignRole('system_admin');

        $this->subjectOfficer = User::create([
            'name' => 'SO Officer',
            'nic' => '199012345678',
            'mobile' => '0777654321',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $this->subjectOfficer->assignRole('subject_officer');
    }

    public function test_system_admin_can_create_another_system_admin(): void
    {
        $payload = [
            'name' => 'Secondary Admin',
            'nic' => '199212345678',
            'mobile' => '0719876543',
            'institution_id' => $this->ministry->id,
            'role' => 'system_admin',
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/users', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('name', 'Secondary Admin');

        $createdUser = User::where('nic', '199212345678')->first();
        $this->assertNotNull($createdUser);
        $this->assertTrue($createdUser->hasRole('system_admin'));
    }

    public function test_non_system_admin_cannot_create_system_admin(): void
    {
        $payload = [
            'name' => 'Rogue Admin',
            'nic' => '199312345678',
            'mobile' => '0719876544',
            'institution_id' => $this->ministry->id,
            'role' => 'system_admin',
        ];

        $response = $this->actingAs($this->subjectOfficer)
            ->postJson('/api/users', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['role']);
    }

    public function test_system_admin_must_be_assigned_to_ministry_institution(): void
    {
        $payload = [
            'name' => 'Hospital Admin',
            'nic' => '199412345678',
            'mobile' => '0719876545',
            'institution_id' => $this->rdhs->id,
            'role' => 'system_admin',
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/users', $payload);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['institution_id']);
    }

    public function test_system_admin_can_update_another_system_admin(): void
    {
        $secondAdmin = User::create([
            'name' => 'Second Admin',
            'nic' => '199512345678',
            'mobile' => '0719876546',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $secondAdmin->assignRole('system_admin');

        $payload = [
            'name' => 'Second Admin Updated',
            'nic' => $secondAdmin->nic,
            'mobile' => '0719876999',
            'institution_id' => $this->ministry->id,
            'role' => 'system_admin',
        ];

        $response = $this->actingAs($this->admin)
            ->putJson("/api/users/{$secondAdmin->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('name', 'Second Admin Updated');
    }

    public function test_non_system_admin_cannot_update_or_delete_system_admin(): void
    {
        $updateResponse = $this->actingAs($this->subjectOfficer)
            ->putJson("/api/users/{$this->admin->id}", [
                'name' => 'Hacked Admin',
                'nic' => $this->admin->nic,
                'mobile' => '0770000000',
                'institution_id' => $this->ministry->id,
                'role' => 'subject_officer',
            ]);

        $updateResponse->assertStatus(403);

        $deleteResponse = $this->actingAs($this->subjectOfficer)
            ->deleteJson("/api/users/{$this->admin->id}");

        $deleteResponse->assertStatus(403);
    }

    public function test_system_admin_cannot_delete_own_account(): void
    {
        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/users/{$this->admin->id}");

        $this->assertTrue(in_array($response->status(), [403, 422], true));
    }

    public function test_cannot_delete_the_only_system_admin(): void
    {
        $targetAdmin = User::create([
            'name' => 'Only Admin',
            'nic' => '199612345678',
            'mobile' => '0719876547',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $targetAdmin->assignRole('system_admin');

        // Delete the main admin first so only targetAdmin remains
        $this->admin->delete();

        // Now targetAdmin is the only admin
        $response = $this->actingAs($targetAdmin)
            ->deleteJson("/api/users/{$targetAdmin->id}");

        $this->assertTrue(in_array($response->status(), [403, 422], true));
    }

    public function test_system_admin_can_delete_another_system_admin_when_multiple_exist(): void
    {
        $secondAdmin = User::create([
            'name' => 'Second Admin',
            'nic' => '199712345678',
            'mobile' => '0719876548',
            'institution_id' => $this->ministry->id,
            'password' => bcrypt('password123'),
        ]);
        $secondAdmin->assignRole('system_admin');

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/users/{$secondAdmin->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('users', ['id' => $secondAdmin->id]);
    }
}
