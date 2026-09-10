<?php

namespace Tests\Feature;

use App\Jobs\CreateBackupJob;
use App\Jobs\RestoreBackupJob;
use App\Models\Backup;
use App\Models\Institution;
use App\Models\User;
use App\Services\BackupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class BackupManagementTest extends TestCase
{
    use RefreshDatabase;

    private function userWith(array $permissions): User
    {
        $institution = Institution::query()->create(['name' => 'Backup Test Institution', 'type' => 'MINISTRY']);
        $user = User::query()->create([
            'name' => 'Backup Test Administrator',
            'nic' => 'NIC'.fake()->unique()->numerify('#########'),
            'mobile' => '07'.fake()->unique()->numerify('########'),
            'password' => 'password',
            'institution_id' => $institution->id,
        ]);
        $role = Role::firstOrCreate(['name' => 'backup-test-admin', 'guard_name' => 'web']);
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }
        $role->syncPermissions($permissions);
        $user->assignRole($role);
        return $user;
    }

    private function fromStatefulSpa(): static
    {
        return $this->withHeader('Origin', 'http://localhost:5173')->withSession([]);
    }

    public function test_authorized_administrator_can_view_and_queue_a_manual_backup(): void
    {
        Queue::fake();
        $user = $this->userWith(['backup.view', 'backup.create']);

        $this->fromStatefulSpa()->actingAs($user)->getJson('/api/admin/backups')->assertOk();
        $this->fromStatefulSpa()->actingAs($user)->postJson('/api/admin/backups')->assertStatus(202)->assertJsonPath('data.status', 'pending');
        $this->assertDatabaseHas('backups', ['type' => 'manual', 'status' => 'pending', 'created_by' => $user->id]);
        Queue::assertPushed(CreateBackupJob::class);
    }

    public function test_system_admin_can_create_a_backup_even_before_permission_cache_is_refreshed(): void
    {
        Queue::fake();
        $user = User::query()->create([
            'name' => 'System Administrator',
            'nic' => 'NIC'.fake()->unique()->numerify('#########'),
            'mobile' => '07'.fake()->unique()->numerify('########'),
            'password' => 'password',
        ]);
        $user->assignRole(Role::firstOrCreate(['name' => 'system_admin', 'guard_name' => 'web']));

        $this->fromStatefulSpa()->actingAs($user)->postJson('/api/admin/backups')->assertStatus(202);
    }

    public function test_user_without_permissions_cannot_view_or_create_backups(): void
    {
        $user = $this->userWith([]);
        $this->fromStatefulSpa()->actingAs($user)->getJson('/api/admin/backups')->assertForbidden();
        $this->fromStatefulSpa()->actingAs($user)->postJson('/api/admin/backups')->assertForbidden();
    }

    public function test_download_requires_permission_and_missing_file_returns_not_found(): void
    {
        $backup = Backup::factory()->create(['status' => 'completed', 'file_path' => 'backups/missing.zip']);
        $denied = $this->userWith(['backup.view']);
        $this->fromStatefulSpa()->actingAs($denied)->getJson("/api/admin/backups/{$backup->id}/download")->assertForbidden();
        $allowed = $this->userWith(['backup.download']);
        $this->fromStatefulSpa()->actingAs($allowed)->getJson("/api/admin/backups/{$backup->id}/download")->assertNotFound();
    }

    public function test_restore_requires_permission_and_is_disabled_by_default(): void
    {
        config(['backups.restore_enabled' => false]);
        $backup = Backup::factory()->create(['status' => 'completed']);
        $denied = $this->userWith([]);
        $this->fromStatefulSpa()->actingAs($denied)->postJson("/api/admin/backups/{$backup->id}/restore", ['confirmation' => 'RESTORE'])->assertForbidden();
        $allowed = $this->userWith(['backup.restore']);
        $this->fromStatefulSpa()->actingAs($allowed)->postJson("/api/admin/backups/{$backup->id}/restore", ['confirmation' => 'RESTORE'])->assertStatus(409);
    }

    public function test_authorized_user_can_queue_restore_only_when_enabled(): void
    {
        Queue::fake();
        config(['backups.restore_enabled' => true]);
        $backup = Backup::factory()->create([
            'status' => 'completed',
            'file_path' => 'backups/verified.zip',
            'checksum' => str_repeat('a', 64),
        ]);
        $user = $this->userWith(['backup.restore']);

        $this->fromStatefulSpa()->actingAs($user)->postJson("/api/admin/backups/{$backup->id}/restore", ['confirmation' => 'RESTORE'])->assertStatus(202);

        $this->assertDatabaseHas('backup_restores', ['backup_id' => $backup->id, 'requested_by' => $user->id, 'status' => 'pending']);
        Queue::assertPushed(RestoreBackupJob::class, fn (RestoreBackupJob $job) => $job->restore->backup_id === $backup->id && $job->restore->requested_by === $user->id);
    }

    public function test_retention_keeps_current_backups_and_removes_expired_ones(): void
    {
        Storage::fake('private');
        $current = Backup::factory()->create(['status' => 'completed', 'file_path' => 'backups/current.zip', 'completed_at' => now()->subDay()]);
        $expired = Backup::factory()->create(['status' => 'completed', 'file_path' => 'backups/expired.zip', 'completed_at' => now()->subDays(366)]);
        Storage::disk('private')->put($current->file_path, 'current');
        Storage::disk('private')->put($expired->file_path, 'expired');

        app(BackupService::class)->pruneExpired();

        $this->assertDatabaseHas('backups', ['id' => $current->id]);
        $this->assertDatabaseMissing('backups', ['id' => $expired->id]);
        Storage::disk('private')->assertMissing($expired->file_path);
    }
}
