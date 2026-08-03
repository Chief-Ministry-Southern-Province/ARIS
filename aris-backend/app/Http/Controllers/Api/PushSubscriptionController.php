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
        $this->authorize('viewAny', PushSubscription::class);

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

        $subscription = PushSubscription::query()
            ->where('endpoint_hash', $endpointHash)
            ->first();

        $attributes = [
                'user_id' => $request->user()->id,
                'endpoint' => $validated['endpoint'],
                'public_key' => $validated['keys']['p256dh'],
                'auth_token' => $validated['keys']['auth'],
                'content_encoding' => $validated['contentEncoding'] ?? 'aes128gcm',
        ];

        if ($subscription) {
            $this->authorize('update', $subscription);
            $subscription->update($attributes);
        } else {
            $this->authorize('create', PushSubscription::class);
            PushSubscription::create(['endpoint_hash' => $endpointHash, ...$attributes]);
        }

        return response()->json(['message' => 'Push notifications enabled.'], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $endpoint = $request->validate(['endpoint' => ['required', 'url', 'max:4096']])['endpoint'];

        $subscription = PushSubscription::query()
            ->where('user_id', $request->user()->id)
            ->where('endpoint_hash', hash('sha256', $endpoint))
            ->first();

        if ($subscription) {
            $this->authorize('delete', $subscription);
            $subscription->delete();
        }

        return response()->json(['message' => 'Push notifications disabled.']);
    }
}
