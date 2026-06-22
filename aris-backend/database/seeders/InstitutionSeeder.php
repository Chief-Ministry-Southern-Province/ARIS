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
        | Southern Provincial Ministry
        |--------------------------------------------------------------------------
        */

        $ministry = Institution::create([
            'name' => 'Southern Provincial Ministry of Health',
            'type' => 'MINISTRY',
            'province' => 'Southern',
            'district' => null,
            'direct_to_rdhs' => false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | PDHS
        |--------------------------------------------------------------------------
        */

        $pdhs = Institution::create([
            'name' => 'Southern Province Department of Health Services',
            'type' => 'PDHS',
            'province' => 'Southern',
            'parent_institution_id' => $ministry->id,
            'direct_to_rdhs' => false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | RDHS Offices
        |--------------------------------------------------------------------------
        */

        $rdhsGalle = Institution::create([
            'name' => 'Regional Director of Health Services - Galle',
            'type' => 'RDHS',
            'district' => 'Galle',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        $rdhsMatara = Institution::create([
            'name' => 'Regional Director of Health Services - Matara',
            'type' => 'RDHS',
            'district' => 'Matara',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        $rdhsHambantota = Institution::create([
            'name' => 'Regional Director of Health Services - Hambantota',
            'type' => 'RDHS',
            'district' => 'Hambantota',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Base Hospitals
        | Directly report to PDHS
        |--------------------------------------------------------------------------
        */

        Institution::create([
            'name' => 'Teaching Hospital Karapitiya',
            'type' => 'BASE_HOSPITAL',
            'district' => 'Galle',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        Institution::create([
            'name' => 'Base Hospital Balapitiya',
            'type' => 'BASE_HOSPITAL',
            'district' => 'Galle',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        Institution::create([
            'name' => 'Base Hospital Elpitiya',
            'type' => 'BASE_HOSPITAL',
            'district' => 'Galle',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        Institution::create([
            'name' => 'Base Hospital Kamburupitiya',
            'type' => 'BASE_HOSPITAL',
            'district' => 'Matara',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        Institution::create([
            'name' => 'Base Hospital Tangalle',
            'type' => 'BASE_HOSPITAL',
            'district' => 'Hambantota',
            'province' => 'Southern',
            'parent_institution_id' => $pdhs->id,
            'direct_to_rdhs' => false,
        ]);

        /*
        |--------------------------------------------------------------------------
        | Divisional Hospitals
        | Must go through RDHS
        |--------------------------------------------------------------------------
        */

        Institution::create([
            'name' => 'Divisional Hospital Baddegama',
            'type' => 'DIVISIONAL_HOSPITAL',
            'district' => 'Galle',
            'province' => 'Southern',
            'parent_institution_id' => $rdhsGalle->id,
            'direct_to_rdhs' => true,
        ]);

        Institution::create([
            'name' => 'Divisional Hospital Ambalangoda',
            'type' => 'DIVISIONAL_HOSPITAL',
            'district' => 'Galle',
            'province' => 'Southern',
            'parent_institution_id' => $rdhsGalle->id,
            'direct_to_rdhs' => true,
        ]);

        Institution::create([
            'name' => 'District Hospital Akuressa',
            'type' => 'DIVISIONAL_HOSPITAL',
            'district' => 'Matara',
            'province' => 'Southern',
            'parent_institution_id' => $rdhsMatara->id,
            'direct_to_rdhs' => true,
        ]);

        Institution::create([
            'name' => 'District General Hospital Matara',
            'type' => 'DIVISIONAL_HOSPITAL',
            'district' => 'Matara',
            'province' => 'Southern',
            'parent_institution_id' => $rdhsMatara->id,
            'direct_to_rdhs' => true,
        ]);

        Institution::create([
            'name' => 'District Hospital Tissamaharama',
            'type' => 'DIVISIONAL_HOSPITAL',
            'district' => 'Hambantota',
            'province' => 'Southern',
            'parent_institution_id' => $rdhsHambantota->id,
            'direct_to_rdhs' => true,
        ]);
    }
}

