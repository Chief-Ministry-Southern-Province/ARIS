<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        return response()->json(
            $this->notificationService->paginateFor(
                $request->user(),
                $request->integer('per_page', 20),
            )
        );
    }

    public function unreadCount(Request $request): JsonResponse
    {
        return response()->json([
            'count' => $this->notificationService->unreadCountFor($request->user()),
        ]);
    }

    public function markAsRead(Request $request, string $notification): JsonResponse
    {
        $item = $this->notificationService->markAsRead($request->user(), $notification);

        return response()->json([
            'message' => 'Notification marked as read.',
            'data' => $item,
        ]);
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        return response()->json([
            'message' => 'Notifications marked as read.',
            'count' => $this->notificationService->markAllAsRead($request->user()),
        ]);
    }
}
