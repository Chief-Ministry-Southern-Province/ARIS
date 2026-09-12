<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('backups', function (Blueprint $table) {
            $table->id();
            $table->string('backup_code')->unique();
            $table->enum('type', ['manual', 'automatic']);
            $table->enum('status', ['pending', 'running', 'completed', 'failed'])->index();
            $table->string('disk');
            $table->string('file_path')->nullable();
            $table->string('file_name')->nullable();
            $table->unsignedBigInteger('file_size')->nullable();
            $table->string('checksum', 64)->nullable();
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('error_message')->nullable();
            $table->timestamps();
            $table->index(['type', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('backups');
    }
};
