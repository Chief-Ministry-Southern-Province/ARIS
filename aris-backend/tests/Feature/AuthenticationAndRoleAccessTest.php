<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationAndRoleAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_user_can_log_in_and_view_their_profile(): void
    {
        $institution = Institution::factory()->ministry()->create();
        $user = User::factory()->for($institution)->withRole('system_admin')->create([
            'name' => 'System Admin',
            'nic' => '199012345678',
            'password' => bcrypt('correct-password'),
        ]);

        $this->fromStatefulSpa()->postJson('/api/login', [
            'nic' => $user->nic,
            'password' => 'correct-password',
        ])->assertOk()
            ->assertJsonPath('message', 'Login successful')
            ->assertJsonPath('id', $user->id)
            ->assertJsonPath('role.0', 'system_admin')
            ->assertJsonPath('institutionId', $institution->id)
            ->assertJsonPath('institutionType', 'MINISTRY');

        $this->fromStatefulSpa()->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('user.id', $user->id)
            ->assertJsonPath('role.0', 'system_admin');
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('correct-password')]);

        $this->fromStatefulSpa()->postJson('/api/login', [
            'nic' => $user->nic,
            'password' => 'wrong-password',
        ])->assertUnauthorized()
            ->assertJsonPath('message', 'Invalid credentials');
    }

    public function test_protected_profile_requires_authentication(): void
    {
        $this->fromStatefulSpa()->getJson('/api/profile')
            ->assertUnauthorized();
    }

    public function test_non_admin_user_without_an_institution_is_blocked_from_protected_routes(): void
    {
        $user = User::factory()->withoutInstitution()->withRole('driver')->create();

        $this->fromStatefulSpa()->actingAs($user)
            ->getJson('/api/profile')
            ->assertForbidden()
            ->assertJsonPath('message', 'User does not have an institution assigned');
    }

    public function test_user_management_is_available_to_system_admin_and_subject_officer_only(): void
    {
        $institution = Institution::factory()->create();
        $admin = User::factory()->for($institution)->withRole('system_admin')->create();
        $subjectOfficer = User::factory()->for($institution)->withRole('subject_officer')->create();
        $driver = User::factory()->for($institution)->withRole('driver')->create();

        $this->fromStatefulSpa()->actingAs($admin)->getJson('/api/users')->assertOk();
        $this->fromStatefulSpa()->actingAs($subjectOfficer)->getJson('/api/users')->assertOk();
        $this->fromStatefulSpa()->actingAs($driver)->getJson('/api/users')->assertForbidden();
    }
}
