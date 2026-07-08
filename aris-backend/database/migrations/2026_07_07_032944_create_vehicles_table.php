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
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();

            $table->string('vehicle_number')->unique();

            $table->date('registered_date')->nullable();

            $table->enum('vehicle_type', [
                'CAR',
                'VAN',
                'BUS',
                'TRUCK',
                'MOTORCYCLE',
                'CAB',
                'THREE_WHEELER',
                'BOWSER',
                'AMBULANCE',
                'OTHER',
            ]);
            $table->string('model');
            $table->string('brand');
            $table->year('manufactured_year');

            $table->string('engine_number')->unique();

            $table->string('chassis_number')->unique();

            $table->string('insurance_number')->unique();

            $table->date('insurance_expiry_date');

            $table->decimal('value', 15, 2)->nullable();

            $table->string('registered_owner');

            $table->enum('fuel_type', [
                'PETROL',
                'DIESEL',
                'HYBRID',
                'ELECTRIC'
            ]);

            $table->enum('status', [
                'ACTIVE',
                'UNDER_MAINTENANCE',
                'OUT_OF_SERVICE',
                'DISPOSED'
            ])->default('ACTIVE');

            $table->foreignId('institution_id')
            ->constrained()
            ->cascadeOnDelete();


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
