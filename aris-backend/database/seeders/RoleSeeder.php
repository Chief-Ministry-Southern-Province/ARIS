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
        Role::create(['name' => 'system_admin']);
        Role::create(['name' => 'driver']);
        Role::create(['name' => 'subject_officer']); 
        Role::create(['name' => 'administrative_officer']); 
        Role::create(['name' => 'medical_superintendent']); 
        Role::create(['name' => 'regional_director']); 
        Role::create(['name' => 'provincial_director']); 
        Role::create(['name' => 'deputy_director']);
        Role::create(['name' => 'secretary']);
        Role::create(['name' => 'assistant_secretary']);
        Role::create(['name' => 'senior_assistant_secretary']);
    }
}
