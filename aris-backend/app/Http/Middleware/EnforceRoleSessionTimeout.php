<?php

namespace App\Http\Middleware;

use Carbon\Carbon;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnforceRoleSessionTimeout
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            return $next($request);
        }

        $timeoutMinutes = $user->hasRole('driver')
            ? 60 * 24 * 30
            : 60 * 8;

        $lastActivity = $request->session()->get('role_session_last_activity');

        if ($lastActivity) {
            $expiresAt = Carbon::createFromTimestamp($lastActivity)
                ->addMinutes($timeoutMinutes);

            if (now()->greaterThan($expiresAt)) {
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                return response()->json([
                    'message' => 'Your session has expired. Please log in again.',
                ], Response::HTTP_UNAUTHORIZED);
            }
        }

        // This creates a sliding timeout that is refreshed by each authenticated request.
        $request->session()->put('role_session_last_activity', now()->timestamp);

        return $next($request);
    }
}
