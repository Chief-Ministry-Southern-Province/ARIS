<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = config('system-admin');

        foreach (['name', 'nic', 'mobile', 'password'] as $key) {
            if (blank($admin[$key] ?? null)) {
                throw new RuntimeException("SYSTEM_ADMIN_{$key} must be set in the .env file.");
            }
        }

        $user = User::query()->updateOrCreate(
            ['nic' => $admin['nic']],
            [
                'name' => $admin['name'],
                'mobile' => $admin['mobile'],
                'institution_id' => $admin['institution_id'],
                'password' => Hash::make($admin['password']),
            ],
        );

        $user->syncRoles(['system_admin']);
    }
}
