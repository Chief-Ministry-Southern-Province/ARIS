<?php

$frontendUrls = explode(',', env('FRONTEND_URLS', 'http://localhost:5173'));

return [
    'frontend_url' => rtrim(env('PASSWORD_SETUP_FRONTEND_URL', trim($frontendUrls[0])), '/'),
    'expires_after_hours' => (int) env('PASSWORD_SETUP_EXPIRES_HOURS', 8),
    'resend_cooldown_seconds' => (int) env('PASSWORD_SETUP_RESEND_COOLDOWN_SECONDS', 60),
];
