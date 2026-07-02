<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureInstitutionAssigned
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if(!$user){
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);
        }

        if($user->hasRole('system_admin')){
            return $next($request);
        }

        if(!$user->institution_id){
            return response()->json([
                'message' => 'User does not have an institution assigned'
            ], 403);
        }
        
        return $next($request);
    }
}
