<?php

use App\Http\Middleware\EnforceRoleSessionTimeout;
use App\Http\Middleware\EnsureInstitutionAssigned;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        [
            'prefix' => 'api',
            'middleware' => ['api', 'auth:sanctum'],
        ],
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->statefulApi();

        $middleware->alias([
            'institution.assigned' => EnsureInstitutionAssigned::class,
            'role.session.timeout' => EnforceRoleSessionTimeout::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*'),
        );

        $exceptions->render(function (Throwable $exception, Request $request) {
            if (! $request->is('api/*') || config('app.debug')) {
                return null;
            }

            if ($exception instanceof ValidationException) {
                return response()->json([
                    'message' => 'Please correct the highlighted fields and try again.',
                    'errors' => $exception->errors(),
                ], 422);
            }

            $status = match (true) {
                $exception instanceof AuthenticationException => 401,
                $exception instanceof AuthorizationException => 403,
                $exception instanceof ModelNotFoundException => 404,
                $exception instanceof HttpExceptionInterface => $exception->getStatusCode(),
                default => 500,
            };

            $message = match ($status) {
                400 => 'We could not process that request. Please check your details and try again.',
                401 => 'Your session has ended. Please log in again.',
                403 => 'You do not have permission to perform this action.',
                404 => 'The requested item could not be found.',
                409 => 'This action conflicts with existing information. Please refresh and try again.',
                419 => 'Your session has expired. Please refresh the page and try again.',
                422 => 'Please correct the highlighted fields and try again.',
                429 => 'Too many requests were made. Please wait a moment and try again.',
                500 => 'Something went wrong on our side. Please try again later.',
                502, 503 => 'The service is temporarily unavailable. Please try again shortly.',
                504 => 'The request took too long. Please try again.',
                default => 'We could not complete your request. Please try again.',
            };

            return response()->json(['message' => $message], $status);
        });
    })->create();
