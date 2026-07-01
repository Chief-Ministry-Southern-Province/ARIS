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
        Schema::create('institutions', function (Blueprint $table) {

            $table->id();

            $table->string('name');

            $table->enum('type', [
                'MINISTRY',
                'PDHS',
                'RDHS',
                'BASE_HOSPITAL',
                'DIVISIONAL_HOSPITAL',
                'MOH',
                'PMCU',
                'UNITS',
                'OTHER',
            ]);

            $table->string('address')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('district')->nullable();
            $table->string('province')->nullable();
            $table->string('head_of_institution')->nullable();

            $table->foreignId('parent_institution_id')
                ->nullable()
                ->constrained('institutions')
                ->nullOnDelete('cascade');

            $table->boolean('direct_to_rdhs')
                ->default(false);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
