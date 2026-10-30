<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_driver_histories', function (Blueprint $table) {
            $table->id();

            $table->foreignId('vehicle_id')
                ->constrained('vehicles')
                ->cascadeOnDelete();

            $table->foreignId('driver_id')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->foreignId('performed_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('action'); // 'ACTIVATED', 'DEACTIVATED'
            $table->text('notes')->nullable();

            $table->timestamps();
        });

        // Back-populate history for vehicles that already have an active driver assigned
        $vehiclesWithDriver = DB::table('vehicles')->whereNotNull('driver_id')->get();
        foreach ($vehiclesWithDriver as $vehicle) {
            DB::table('vehicle_driver_histories')->insert([
                'vehicle_id' => $vehicle->id,
                'driver_id' => $vehicle->driver_id,
                'performed_by' => null,
                'action' => 'ACTIVATED',
                'notes' => 'Initial active assignment',
                'created_at' => $vehicle->updated_at ?? now(),
                'updated_at' => $vehicle->updated_at ?? now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_driver_histories');
    }
};
