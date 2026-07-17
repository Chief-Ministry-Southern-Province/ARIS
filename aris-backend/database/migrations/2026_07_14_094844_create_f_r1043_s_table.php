<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fr1043s', function (Blueprint $table) {

            $table->id();

            $table->string('reference_number');

            $table->foreignId('accident_case_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('created_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->unsignedInteger('revision')
                ->default(1);

            $table->enum('status', [
                'DRAFT',
                'SUBMITTED',
                'UNDER_APPROVAL',
                'CHANGES_REQUESTED',
                'APPROVED',

            ])->default('DRAFT');

            $table->json('data');

            $table->timestamp('submitted_at')
                ->nullable();

            $table->timestamp('approved_at')
                ->nullable();

            $table->timestamps();

            $table->unique([
                'accident_case_id',
                'revision',
            ]);

            $table->unique([
                'reference_number',
                'revision',
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fr1043s');
    }
};
