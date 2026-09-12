<?php

return [
    'name' => env('SYSTEM_ADMIN_NAME'),
    'nic' => env('SYSTEM_ADMIN_NIC'),
    'mobile' => env('SYSTEM_ADMIN_MOBILE'),
    'institution_id' => (int) env('SYSTEM_ADMIN_INSTITUTION_ID', 1),
    'password' => env('SYSTEM_ADMIN_PASSWORD'),
];
