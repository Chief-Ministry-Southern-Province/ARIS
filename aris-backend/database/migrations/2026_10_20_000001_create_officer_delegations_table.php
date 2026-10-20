<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('officer_delegations', function (Blueprint $table) {
            $table->id();

            $table->foreignId('institution_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('officer_id')
                ->comment('Original officer on leave or absent')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('acting_officer_id')
                ->comment('Officer covering duties / acting in post')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('role')
                ->comment('The role being covered');

            $table->date('start_date');

            $table->date('end_date')
                ->nullable()
                ->comment('Null indicates covering duties until revoked');

            $table->string('reason')
                ->comment('SICK_LEAVE, DUTY_LEAVE, VACATION, RESIGNATION, OTHER');

            $table->text('notes')
                ->nullable();

            $table->boolean('is_active')
                ->default(true);

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->timestamps();

            $table->index(['officer_id', 'is_active']);
            $table->index(['acting_officer_id', 'is_active']);
            $table->index(['institution_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('officer_delegations');
    }
};
