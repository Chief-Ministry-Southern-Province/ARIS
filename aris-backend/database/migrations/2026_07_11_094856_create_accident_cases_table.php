<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('accident_cases', function (Blueprint $table) {

            $table->id();

            $table->string('case_number')->unique();

            $table->foreignId('accident_id')
                ->unique()
                ->constrained()
                ->onDelete('cascade');

            $table->foreignId('institution_id')
                ->constrained('institutions')
                ->onDelete('cascade');

            $table->foreignId('created_by')
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('assigned_to')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->enum('current_stage', [
                'ACCIDENT_REPORTED',
                'FR1043',
                'FR1044',
                'FR109',
                'CLOSED',
            ])->default('ACCIDENT_REPORTED');

            $table->enum('status', [
                'OPEN',
                'IN_PROGRESS',
                'ON_HOLD',
                'COMPLETED',
                'CLOSED',
            ])->default('OPEN');

            $table->enum('priority', [
                'LOW',
                'MEDIUM',
                'HIGH',
                'URGENT',

            ])->default('MEDIUM');

            $table->dateTime('closed_at')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accident_cases');
    }
};
