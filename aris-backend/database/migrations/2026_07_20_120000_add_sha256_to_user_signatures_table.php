<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_signatures', function (Blueprint $table) {
            $table->char('sha256', 64)->nullable()->after('path')->index();
        });
    }

    public function down(): void
    {
        Schema::table('user_signatures', function (Blueprint $table) {
            $table->dropIndex(['sha256']);
            $table->dropColumn('sha256');
        });
    }
};
