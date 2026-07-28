<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->foreignId('institution_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('action');

            $table->string('module');

            $table->string('entity_type');

            $table->unsignedBigInteger('entity_id')->nullable();

            $table->string('entity_public_id')->nullable();

            $table->json('old_values')->nullable();

            $table->json('new_values')->nullable();

            $table->text('description')->nullable();

            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('url')->nullable();
            $table->string('method')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('institution_id');
            $table->index('action');
            $table->index('module');
            $table->index('entity_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};