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
        $name = env('INITIAL_ADMIN_NAME');
        $nic = env('INITIAL_ADMIN_NIC');
        $mobile = env('INITIAL_ADMIN_MOBILE');
        $password = env('INITIAL_ADMIN_PASSWORD');
        $institutionId = filter_var(env('INITIAL_ADMIN_INSTITUTION_ID'), FILTER_VALIDATE_INT);

        if (!is_string($name) || !is_string($nic) || !is_string($mobile) || !is_string($password) || !$institutionId) {
            throw new RuntimeException(
                'Set INITIAL_ADMIN_NAME, INITIAL_ADMIN_NIC, INITIAL_ADMIN_MOBILE, INITIAL_ADMIN_PASSWORD, and INITIAL_ADMIN_INSTITUTION_ID before running AdminSeeder.',
            );
        }

        $user = User::firstOrCreate(
            ['nic' => $nic],
            [
                'name' => $name,
                'mobile' => $mobile,
                'institution_id' => $institutionId,
                'password' => Hash::make($password),
            ],
        );

        if (!$user->hasRole('system_admin')) {
            $user->assignRole('system_admin');
        }
    }
}
