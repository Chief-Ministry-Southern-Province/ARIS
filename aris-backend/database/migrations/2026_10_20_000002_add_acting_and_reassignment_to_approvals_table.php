<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('approvals', function (Blueprint $table) {
            $table->foreignId('acted_by_id')
                ->nullable()
                ->after('approver_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('delegation_id')
                ->nullable()
                ->after('acted_by_id')
                ->constrained('officer_delegations')
                ->nullOnDelete();

            $table->foreignId('reassigned_from_id')
                ->nullable()
                ->after('delegation_id')
                ->constrained('users')
                ->nullOnDelete();

            $table->string('reassign_reason')
                ->nullable()
                ->after('reassigned_from_id');
        });
    }

    public function down(): void
    {
        Schema::table('approvals', function (Blueprint $table) {
            $table->dropConstrainedForeignId('acted_by_id');
            $table->dropConstrainedForeignId('delegation_id');
            $table->dropConstrainedForeignId('reassigned_from_id');
            $table->dropColumn('reassign_reason');
        });
    }
};
