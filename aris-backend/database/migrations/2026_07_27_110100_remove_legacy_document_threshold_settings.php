<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('workflow_settings')) {
            return;
        }

        DB::table('workflow_settings')->whereIn('key', [
            'fr1043.treasury_threshold',
            'fr1043.enable_treasury',
            'fr1043.pdhs_threshold',
            'fr1043.ministry_threshold',
            'fr1043.treasury_secretary_user_id',
            'fr1044.pdhs_threshold',
            'fr1044.ministry_threshold',
            'fr1044.treasury_secretary_user_id',
            'workflow.treasury_secretary_user_id',
        ])->delete();
    }

    public function down(): void
    {
        // Removed settings are obsolete and must not be recreated on rollback.
    }
};
