<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicle_drivers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vehicle_id')->constrained('vehicles')->cascadeOnDelete();
            $table->foreignId('driver_id')->constrained('users')->cascadeOnDelete();
            $table->boolean('is_active')->default(false);
            $table->timestamps();

            $table->unique(['vehicle_id', 'driver_id']);
        });

        // Back-populate existing driver_id assignments as active drivers
        $vehiclesWithDrivers = DB::table('vehicles')->whereNotNull('driver_id')->get(['id', 'driver_id']);
        foreach ($vehiclesWithDrivers as $v) {
            DB::table('vehicle_drivers')->insertOrIgnore([
                'vehicle_id' => $v->id,
                'driver_id' => $v->driver_id,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicle_drivers');
    }
};
