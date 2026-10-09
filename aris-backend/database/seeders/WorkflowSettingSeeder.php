<?php

namespace Database\Seeders;

use App\Models\WorkflowSetting;
use Illuminate\Database\Seeder;

class WorkflowSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WorkflowSetting::firstOrCreate(
            ['key' => 'workflow.pdhs_threshold'],
            [
                'value' => '0',
                'type' => 'integer',
                'description' => 'Maximum loss amount handled by PDHS for FR1043 and FR1044',
            ]
        );

        WorkflowSetting::firstOrCreate(
            ['key' => 'workflow.ministry_threshold'],
            [
                'value' => '0',
                'type' => 'integer',
                'description' => 'Maximum loss amount handled by Ministry for FR1043 and FR1044',
            ]
        );

    }
}
