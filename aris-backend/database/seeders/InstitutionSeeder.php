<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Institution;

class InstitutionSeeder extends Seeder
{
    public function run(): void
    {
        /*
        |--------------------------------------------------------------------------
        | Southern Provincial Ministry (ID = 1)
        |--------------------------------------------------------------------------
        */

        $ministry = Institution::firstOrCreate(
            ['name' => 'Southern Provincial Ministry of Health'],
            [
                'type' => 'MINISTRY',
                'province' => 'Southern',
                'district' => null,
                'direct_to_rdhs' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | PDHS
        |--------------------------------------------------------------------------
        */

        $pdhs = Institution::firstOrCreate(
            ['name' => 'Southern Province Department of Health Services'],
            [
                'type' => 'PDHS',
                'province' => 'Southern',
                'parent_institution_id' => $ministry->id,
                'direct_to_rdhs' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | RDHS Offices
        |--------------------------------------------------------------------------
        */

        $rdhsGalle = Institution::firstOrCreate(
            ['name' => 'Regional Director of Health Services - Galle'],
            [
                'type' => 'RDHS',
                'district' => 'Galle',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        $rdhsMatara = Institution::firstOrCreate(
            ['name' => 'Regional Director of Health Services - Matara'],
            [
                'type' => 'RDHS',
                'district' => 'Matara',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        $rdhsHambantota = Institution::firstOrCreate(
            ['name' => 'Regional Director of Health Services - Hambantota'],
            [
                'type' => 'RDHS',
                'district' => 'Hambantota',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Base Hospitals
        | Directly report to PDHS
        |--------------------------------------------------------------------------
        */

        Institution::firstOrCreate(
            ['name' => 'Teaching Hospital Karapitiya'],
            [
                'type' => 'BASE_HOSPITAL',
                'district' => 'Galle',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'Base Hospital Balapitiya'],
            [
                'type' => 'BASE_HOSPITAL',
                'district' => 'Galle',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'Base Hospital Elpitiya'],
            [
                'type' => 'BASE_HOSPITAL',
                'district' => 'Galle',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'Base Hospital Kamburupitiya'],
            [
                'type' => 'BASE_HOSPITAL',
                'district' => 'Matara',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'Base Hospital Tangalle'],
            [
                'type' => 'BASE_HOSPITAL',
                'district' => 'Hambantota',
                'province' => 'Southern',
                'parent_institution_id' => $pdhs->id,
                'direct_to_rdhs' => false,
            ]
        );

        /*
        |--------------------------------------------------------------------------
        | Divisional Hospitals
        | Must go through RDHS
        |--------------------------------------------------------------------------
        */

        Institution::firstOrCreate(
            ['name' => 'Divisional Hospital Baddegama'],
            [
                'type' => 'DIVISIONAL_HOSPITAL',
                'district' => 'Galle',
                'province' => 'Southern',
                'parent_institution_id' => $rdhsGalle->id,
                'direct_to_rdhs' => true,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'Divisional Hospital Ambalangoda'],
            [
                'type' => 'DIVISIONAL_HOSPITAL',
                'district' => 'Galle',
                'province' => 'Southern',
                'parent_institution_id' => $rdhsGalle->id,
                'direct_to_rdhs' => true,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'District Hospital Akuressa'],
            [
                'type' => 'DIVISIONAL_HOSPITAL',
                'district' => 'Matara',
                'province' => 'Southern',
                'parent_institution_id' => $rdhsMatara->id,
                'direct_to_rdhs' => true,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'District General Hospital Matara'],
            [
                'type' => 'DIVISIONAL_HOSPITAL',
                'district' => 'Matara',
                'province' => 'Southern',
                'parent_institution_id' => $rdhsMatara->id,
                'direct_to_rdhs' => true,
            ]
        );

        Institution::firstOrCreate(
            ['name' => 'District Hospital Tissamaharama'],
            [
                'type' => 'DIVISIONAL_HOSPITAL',
                'district' => 'Hambantota',
                'province' => 'Southern',
                'parent_institution_id' => $rdhsHambantota->id,
                'direct_to_rdhs' => true,
            ]
        );
    }
}

