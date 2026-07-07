<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;


Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password/send-otp', [ForgotPasswordController::class, 'sendOtp']);

Route::post('/forgot-password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);

Route::post('/forgot-password/reset-password', [ForgotPasswordController::class, 'resetPassword']);


Route::middleware(['auth:sanctum','institution.assigned'])->group(function () {

    // Protected routes for authenticated users with assigned institutions
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    Route::apiResource('users', UserController::class);

    // Protected routes for institutions with assigned users
    Route::apiResource('institutions', InstitutionController::class);

    Route::get('/institution-types', [InstitutionController::class, 'allowedTypes']);

    Route::get('/parent-institutions', [InstitutionController::class, 'getParentInstitutions']);

    Route::get('/visible-institutions', [InstitutionController::class, 'getVisibleInstitutionsForUser']);

    // Protected routes for vehicles with assigned institutions
    Route::apiResource('vehicles', \App\Http\Controllers\Api\VehicleController::class);
});

