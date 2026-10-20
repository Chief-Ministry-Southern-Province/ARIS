<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\InstitutionSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            InstitutionSeeder::class,
            RoleSeeder::class,
            AdminSeeder::class,
            WorkflowSettingSeeder::class,
        ]);
    }
}
