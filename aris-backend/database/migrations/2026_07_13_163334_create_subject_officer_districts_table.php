<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subject_officer_districts', function (Blueprint $table) {

            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('district');

            $table->timestamps();

            $table->unique([
                'user_id',
                'district'
            ]);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subject_officer_districts');
    }
};