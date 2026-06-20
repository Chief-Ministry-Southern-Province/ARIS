<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'ARIS API',
        'status' => 'healthy',
        'version' => '1.0.0',
        'timestamp' => now()->toDateTimeString(),
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
    ]);
});