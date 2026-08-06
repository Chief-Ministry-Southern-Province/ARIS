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
use App\Http\Controllers\Api\FR109Controller;
use App\Http\Controllers\Api\UserSignatureController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\WorkflowSettingController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\PushSubscriptionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AnalyticsController;

Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password/send-otp', [ForgotPasswordController::class, 'sendOtp']);

Route::post('/forgot-password/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);

Route::post('/forgot-password/reset-password', [ForgotPasswordController::class, 'resetPassword']);


Route::middleware(['auth:sanctum', 'role.session.timeout', 'institution.assigned'])->group(function () {

    // Protected routes for authenticated users with assigned institutions
    Route::get('/profile', [AuthController::class, 'profile']);

    Route::get('/dashboard/statistics', [DashboardController::class, 'statistics']);
    Route::get('/analytics', [AnalyticsController::class, 'index']);

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::post('/update-profile', [AuthController::class, 'updateProfile']);

    // Authenticated user's database notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);

    // Push-subscription endpoints never expose endpoint or encryption keys.
    Route::get('/push-subscriptions/status', [PushSubscriptionController::class, 'status']);
    Route::post('/push-subscriptions', [PushSubscriptionController::class, 'store']);
    Route::delete('/push-subscriptions', [PushSubscriptionController::class, 'destroy']);

    Route::get('/audit-logs', [AuditLogController::class, 'index']);

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
    Route::post('/cases/{accidentCase}/assign', [AccidentCaseController::class, 'assign']);

    // Protected routes for case history
    Route::get('/cases/{accidentCase}/history',[CaseHistoryController::class, 'index']);

    // Protected routes for approvals
    Route::get('/approvals/pending',[ApprovalController::class, 'pending']);

    Route::get('/approvals/decided',[ApprovalController::class, 'decided']);

    Route::get('/approvals/stats',[ApprovalController::class, 'stats']);

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

    Route::get('/fr1043/{fr1043}/pdf',[FR1043Controller::class, 'downloadPdf']);

    // Protected routes for FR1044
    Route::prefix('cases')->group(function () {
        Route::get('/{accidentCase}/fr1044',[FR1044Controller::class, 'show']);
        Route::get('/{accidentCase}/fr1044/history',[FR1044Controller::class, 'history']);
        Route::post('/{accidentCase}/fr1044',[FR1044Controller::class, 'store']);
    });

    Route::put('/fr1044/{fr1044}',[FR1044Controller::class, 'update']);
    Route::post('/fr1044/{fr1044}/submit',[FR1044Controller::class, 'submit']);
    Route::get('/fr1044/{fr1044}/pdf',[FR1044Controller::class, 'downloadPdf']);
    Route::post('/fr1044/{fr1044}/attachments',[FR1044Controller::class, 'attachment']);
    Route::get('/fr1044/{fr1044}/attachments/{fieldKey}',[FR1044Controller::class, 'attachmentPreview']);

    // Protected routes for FR109
    Route::get('/cases/{accidentCase}/fr109', [FR109Controller::class, 'show']);
    Route::post('/cases/{accidentCase}/fr109', [FR109Controller::class, 'save']);
    Route::post('/cases/{accidentCase}/fr109/submit', [FR109Controller::class, 'submit']);
    Route::put('/fr109/{fr109}/write-off', [FR109Controller::class, 'updateWriteOff']);
    Route::put('/fr109/{fr109}/chief-accounting-order', [FR109Controller::class, 'updateChiefAccountingOrder']);
    Route::put('/fr109/{fr109}/chief-secretary-decision', [FR109Controller::class, 'updateChiefSecretaryDecision']);

    //Protected routes for user signature
    Route::post('/user/signature', [UserSignatureController::class, 'store']);

    Route::get('/user/signature/status', [UserSignatureController::class, 'status']);

    Route::get('/user/signature/{signature}', [UserSignatureController::class, 'show']);

    Route::delete('/user/signature', [UserSignatureController::class, 'destroy']);

    // Protected routes for workflow settings
    Route::get('/workflow-settings',[WorkflowSettingController::class, 'index']);

    Route::put('/workflow-settings',[WorkflowSettingController::class, 'update']);
});

Route::get('/phpinfo', fn () => phpinfo());
