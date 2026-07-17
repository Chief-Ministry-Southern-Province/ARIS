<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accident_evidence', function (Blueprint $table) {
            $table->string('document_type')->nullable()->after('accident_id');
            $table->unsignedInteger('document_revision')->nullable()->after('document_type');
            $table->string('field_key')->nullable()->after('document_revision');
            $table->index(['accident_id', 'document_type', 'document_revision'], 'evidence_document_lookup');
        });
    }

    public function down(): void
    {
        Schema::table('accident_evidence', function (Blueprint $table) {
            $table->dropIndex('evidence_document_lookup');
            $table->dropColumn(['document_type', 'document_revision', 'field_key']);
        });
    }
};
