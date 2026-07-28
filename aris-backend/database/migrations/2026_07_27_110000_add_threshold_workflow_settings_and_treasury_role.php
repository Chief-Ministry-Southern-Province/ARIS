<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        if (Schema::hasTable('roles')) {
            DB::table('roles')->insertOrIgnore([
                'name' => 'treasury_secretary',
                'guard_name' => 'web',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        if (! Schema::hasTable('workflow_settings')) {
            return;
        }

        $settings = [
            [
                'key' => 'workflow.pdhs_threshold',
                'value' => '0',
                'type' => 'integer',
                'description' => 'Maximum loss amount handled by PDHS for FR1043 and FR1044',
            ],
            [
                'key' => 'workflow.ministry_threshold',
                'value' => '0',
                'type' => 'integer',
                'description' => 'Maximum loss amount handled by Ministry for FR1043 and FR1044',
            ],
        ];

        foreach ($settings as $setting) {
            DB::table('workflow_settings')->insertOrIgnore([
                ...$setting,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        
    }
};
