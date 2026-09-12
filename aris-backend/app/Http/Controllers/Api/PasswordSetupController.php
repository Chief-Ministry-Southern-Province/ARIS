<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CompletePasswordSetupRequest;
use App\Http\Requests\Auth\ValidatePasswordSetupTokenRequest;
use App\Services\PasswordSetupService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class PasswordSetupController extends Controller
{
    public function __construct(private PasswordSetupService $passwordSetup)
    {
    }

    public function validateToken(ValidatePasswordSetupTokenRequest $request): JsonResponse
    {
        try {
            $this->passwordSetup->validateToken($request->string('token')->toString());
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['valid' => true]);
    }

    public function setup(CompletePasswordSetupRequest $request): JsonResponse
    {
        try {
            $this->passwordSetup->complete(
                $request->string('token')->toString(),
                $request->string('password')->toString(),
            );
        } catch (RuntimeException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json(['message' => 'Password set successfully. You can now log in.']);
    }
}
