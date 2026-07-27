<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'system_admin']);
        Role::firstOrCreate(['name' => 'driver']);
        Role::firstOrCreate(['name' => 'subject_officer']);
        Role::firstOrCreate(['name' => 'administrative_officer']);
        Role::firstOrCreate(['name' => 'medical_superintendent']);
        Role::firstOrCreate(['name' => 'regional_director']);
        Role::firstOrCreate(['name' => 'provincial_director']);
        Role::firstOrCreate(['name' => 'deputy_director']);
        Role::firstOrCreate(['name' => 'secretary']);
        Role::firstOrCreate(['name' => 'assistant_secretary']);
        Role::firstOrCreate(['name' => 'senior_assistant_secretary']);
        Role::firstOrCreate(['name' => 'treasury_secretary']);
    }
}
