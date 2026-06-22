<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InstitutionController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('hello', function () {
    return response()->json(['message' => 'Hello, World!']);
});

Route::apiResource('institutions', InstitutionController::class);
