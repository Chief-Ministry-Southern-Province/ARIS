<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('backup_restores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('backup_id')->constrained('backups')->cascadeOnDelete();
            $table->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('emergency_backup_id')->nullable()->constrained('backups')->nullOnDelete();
            $table->enum('status', ['pending', 'running', 'completed', 'failed'])->index();
            $table->string('message')->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backup_restores');
    }
};
