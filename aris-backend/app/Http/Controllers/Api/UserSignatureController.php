<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StoreSignatureRequest;
use App\Models\UserSignature;
use App\Services\Signature\SignatureService;
use App\Services\Signature\SignatureStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Http\Controllers\Controller;

class UserSignatureController extends Controller
{
    public function __construct(
        protected SignatureService $signatureService,
        protected SignatureStorageService $storageService
    ) {}

    /**
     * Upload or replace the authenticated user's signature.
     */
    public function store(StoreSignatureRequest $request): JsonResponse
    {
        $signature = $this->signatureService->upload(
            $request->user(),
            $request->file('signature')
        );

        return response()->json([
            'success' => true,
            'message' => 'Signature uploaded successfully.',
            'data' => [
                'public_id'=>$signature->public_id,
                'is_active' => $signature->is_active,
                'created_at' => $signature->created_at,
            ]
        ], 201);
    }

    /**
     * Stream a signature image.
     *
     * NOTE:
     * Authorization will be added in Phase 3.
     */
    public function show(UserSignature $signature): StreamedResponse
    {
        return $this->storageService->response(
            $signature->path
        );
    }

    /**
     * Get current user's active signature.
     */
    public function status(Request $request): JsonResponse
    {
        $signature = $request->user()
            ->signatures()
            ->where('is_active', true)
            ->latest()
            ->first();

        return response()->json([
            'has_signature' => (bool) $signature,
            'data' => $signature
                ? [
                    'public_id' => $signature->public_id,
                    'created_at' => $signature->created_at,
                ]
                : null,
        ]);
    }

    /**
     * Remove current active signature.
     */
    public function destroy(Request $request): JsonResponse
    {
        $signature = $request->user()
            ->signatures()
            ->where('is_active', true)
            ->latest()
            ->first();

        if (!$signature) {
            return response()->json([
                'success' => false,
                'message' => 'No active signature found.'
            ], 404);
        }

        $this->signatureService->delete($signature);

        return response()->json([
            'success' => true,
            'message' => 'Signature removed successfully.'
        ]);
    }
}