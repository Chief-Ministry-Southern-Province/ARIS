<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('roles') || ! Schema::hasTable('permissions') || ! Schema::hasTable('role_has_permissions')) {
            return;
        }

        $role = DB::table('roles')->where('name', 'system_admin')->first();
        if (! $role) {
            return;
        }

        foreach (['backup.view', 'backup.create', 'backup.download', 'backup.delete', 'backup.restore'] as $permissionName) {
            DB::table('permissions')->insertOrIgnore(['name' => $permissionName, 'guard_name' => 'web']);
            $permissionId = DB::table('permissions')->where('name', $permissionName)->where('guard_name', 'web')->value('id');
            DB::table('role_has_permissions')->insertOrIgnore(['permission_id' => $permissionId, 'role_id' => $role->id]);
        }
    }

    public function down(): void
    {
        // Permissions are intentionally retained because they may be assigned to other authorized roles.
    }
};
