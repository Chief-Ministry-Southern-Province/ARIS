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
        Schema::create('accidents', function (Blueprint $table) {

            $table->id();

            $table->string('reference_number')->unique();

            $table->foreignId('institution_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('reported_by')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->foreignId('vehicle_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('driver_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->date('accident_date');

            $table->time('accident_time');

            $table->enum('severity', [
                'MINOR',
                'MAJOR',
                'FATAL',
            ]);

            $table->string('province');

            $table->string('district');

            $table->string('location');

            $table->decimal('latitude', 10, 7)->nullable();

            $table->decimal('longitude', 10, 7)->nullable();

            $table->unsignedInteger('injury_count')->default(0);

            $table->unsignedInteger('fatality_count')->default(0);

            $table->enum('road_condition', [
                'DRY',
                'WET',
                'FLOODED',
                'GRAVEL',
                'UNDER_CONSTRUCTION',
                'OTHER',
            ]);

            $table->enum('weather_condition', [
                'SUNNY',
                'RAINY',
                'CLOUDY',
                'FOGGY',
                'WINDY',
                'OTHER',
            ]);

            $table->enum('status', [
                'REPORTED',
                'UNDER_INVESTIGATION',
                'COMPLETED',
                'CLOSED',
            ])->default('REPORTED');

            $table->text('description')->nullable();

            $table->text('vehicle_damage')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accidents');
    }
};