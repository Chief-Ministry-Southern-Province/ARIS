<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\AccidentController;
use App\Http\Controllers\Api\EvidenceController;
use App\Http\Controllers\Api\AccidentCaseController;
use App\Http\Controllers\Api\CaseHistoryController;
use App\Http\Controllers\Api\ApprovalController;
use App\Http\Controllers\Api\FR1043Controller;
use App\Http\Controllers\Api\FR1044Controller;

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

    Route::get('/available-drivers', [UserController::class, 'getAvailableDrivers']);

    // Protected routes for institutions with assigned users
    Route::apiResource('institutions', InstitutionController::class);

    Route::get('/institution-types', [InstitutionController::class, 'allowedTypes']);

    Route::get('/parent-institutions', [InstitutionController::class, 'getParentInstitutions']);

    Route::get('/visible-institutions', [InstitutionController::class, 'getVisibleInstitutionsForUser']);

    // Protected routes for vehicles with assigned institutions
    Route::apiResource('vehicles', VehicleController::class);

    // Protected routes for accidents
    Route::apiResource('accidents', AccidentController::class);

    // Protected routes for accident evidence
    Route::get('/accidents/{accident}/evidence', [EvidenceController::class, 'index']);

    Route::post('/accidents/{accident}/evidence', [EvidenceController::class, 'store']);

    Route::get('/accidents/{accident}/evidence/{evidence}', [EvidenceController::class, 'download']);

    Route::delete('/accidents/{accident}/evidence/{evidence}', [EvidenceController::class, 'destroy']);

    // Protected routes for accident cases
    Route::get('/cases',[AccidentCaseController::class, 'index']);

    Route::get('/cases/{accidentCase}',[AccidentCaseController::class, 'show']);

    Route::put('/cases/{accidentCase}',[AccidentCaseController::class, 'update']);

    // Protected routes for case history
    Route::get('/cases/{accidentCase}/history',[CaseHistoryController::class, 'index']);

    // Protected routes for approvals
    Route::get('/approvals/pending',[ApprovalController::class, 'pending']);

    Route::get('/approvals/{approval}/document',[ApprovalController::class, 'document']);

    Route::get('/cases/{accidentCase}/approvals',[ApprovalController::class, 'history']);

    Route::post('/approvals/{approval}/approve',[ApprovalController::class, 'approve']);

    Route::post('/approvals/{approval}/reject',[ApprovalController::class, 'reject']);

    // Protected routes for FR1043
    Route::prefix('cases')->group(function () {

        Route::get('/{accidentCase}/fr1043',[FR1043Controller::class, 'show']);

        Route::get('/{accidentCase}/fr1043/history',[FR1043Controller::class, 'history']);

        Route::post('/{accidentCase}/fr1043',[FR1043Controller::class, 'store']);
    });

    Route::put('/fr1043/{fr1043}',[FR1043Controller::class, 'update']);

    Route::post('/fr1043/{fr1043}/submit',[FR1043Controller::class, 'submit']);

    // Protected routes for FR1044
    Route::prefix('cases')->group(function () {
        Route::get('/{accidentCase}/fr1044',[FR1044Controller::class, 'show']);
        Route::get('/{accidentCase}/fr1044/history',[FR1044Controller::class, 'history']);
        Route::post('/{accidentCase}/fr1044',[FR1044Controller::class, 'store']);
    });

    Route::put('/fr1044/{fr1044}',[FR1044Controller::class, 'update']);
    Route::post('/fr1044/{fr1044}/submit',[FR1044Controller::class, 'submit']);
});

Route::get('/phpinfo', fn () => phpinfo());
