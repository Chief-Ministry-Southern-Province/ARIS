<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\WorkflowSetting;

class WorkflowSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        WorkflowSetting::updateOrCreate(
            ['key' => 'fr1043.treasury_threshold'],
            [
                'value' => '500000',
                'type' => 'integer',
                'description' => 'Treasury approval threshold for FR1043',
            ]
        );

        WorkflowSetting::updateOrCreate(
            ['key' => 'fr1043.enable_treasury'],
            [
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Enable Secretary of Treasury approval',
            ]
        );
    }
}
