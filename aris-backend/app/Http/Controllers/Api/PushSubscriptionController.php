<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePushSubscriptionRequest;
use App\Models\PushSubscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        return response()->json([
            'subscribed' => PushSubscription::query()
                ->where('user_id', $request->user()->id)
                ->exists(),
        ]);
    }

    public function store(StorePushSubscriptionRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $endpointHash = hash('sha256', $validated['endpoint']);

        PushSubscription::query()->updateOrCreate(
            ['endpoint_hash' => $endpointHash],
            [
                'user_id' => $request->user()->id,
                'endpoint' => $validated['endpoint'],
                'public_key' => $validated['keys']['p256dh'],
                'auth_token' => $validated['keys']['auth'],
                'content_encoding' => $validated['contentEncoding'] ?? 'aes128gcm',
            ],
        );

        return response()->json(['message' => 'Push notifications enabled.'], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $endpoint = $request->validate(['endpoint' => ['required', 'url', 'max:4096']])['endpoint'];

        PushSubscription::query()
            ->where('user_id', $request->user()->id)
            ->where('endpoint_hash', hash('sha256', $endpoint))
            ->delete();

        return response()->json(['message' => 'Push notifications disabled.']);
    }
}
