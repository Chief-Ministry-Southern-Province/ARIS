<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::create([
            'name' => 'Admin User',
            'nic' => '123456789V',
            'mobile' => '0771234567',
            'institution_id' => 1,
            'password' => Hash::make('123456789'),
        ]);
        $user->assignRole('system_admin');
    }
}
