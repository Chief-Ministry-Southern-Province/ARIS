<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('workflow_settings')) {
            DB::table('workflow_settings')
                ->where('key', 'workflow.treasury_secretary_user_id')
                ->delete();
        }
    }

    public function down(): void
    {
        // The obsolete manual-user setting must not be restored.
    }
};
