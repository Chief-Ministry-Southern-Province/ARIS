<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('approvals', function (Blueprint $table) {
            $table->enum('status', [
                'PENDING',
                'WAITING',
                'RECOMMENDED',
                'APPROVED',
                'REJECTED',
                'SKIPPED',
            ])->default('PENDING')->change();
        });
    }

    public function down(): void
    {
        DB::table('approvals')
            ->where('status', 'RECOMMENDED')
            ->update(['status' => 'APPROVED']);

        Schema::table('approvals', function (Blueprint $table) {
            $table->enum('status', [
                'PENDING',
                'WAITING',
                'APPROVED',
                'REJECTED',
                'SKIPPED',
            ])->default('PENDING')->change();
        });
    }
};
