<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('notifications') || !Schema::hasColumn('notifications', 'id')) {
            return;
        }

        $type = Schema::getColumnType('notifications', 'id');

        if (in_array($type, ['char', 'varchar', 'uuid'], true)) {
            return;
        }

        Schema::table('notifications', function (Blueprint $table) {
            $table->uuid('id')->change();
        });
    }

    public function down(): void
    {
        // Numeric IDs cannot safely represent existing UUID notification IDs.
    }
};
