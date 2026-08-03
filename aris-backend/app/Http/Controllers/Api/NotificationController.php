<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Services\Notifications\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService,
    ) {
    }

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Notification::class);

        return response()->json(
            $this->notificationService->paginateFor(
                $request->user(),
                $request->integer('per_page', 20),
            )
        );
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Notification::class);

        return response()->json([
            'count' => $this->notificationService->unreadCountFor($request->user()),
        ]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        $item = Notification::query()
            ->where('user_id', $request->user()->id)
            ->findOrFail($notification);

        $this->authorize('update', $item);

        $item = $this->notificationService->markAsRead($request->user(), $item->id);

        return response()->json([
            'message' => 'Notification marked as read.',
            'data' => $item,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->authorize('markAll', Notification::class);

        return response()->json([
            'message' => 'Notifications marked as read.',
            'count' => $this->notificationService->markAllAsRead($request->user()),
        ]);
    }
}
