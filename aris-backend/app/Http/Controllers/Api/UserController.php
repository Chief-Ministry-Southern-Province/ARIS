<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Services\InstitutionService;
use App\Services\PasswordSetupService;
use App\Models\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use RuntimeException;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', User::class);

        $search = $request->query('search');

        $institutionIds = app(InstitutionService::class)
            ->accessibleInstitutionIds($request->user());

        $users = User::with(['institution', 'roles', 'districts'])
            ->whereIn('institution_id', $institutionIds)
            ->when($search, function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('nic', 'LIKE', "%{$search}%")
                    ->orWhere('mobile', 'LIKE', "%{$search}%")
                    ->orWhereHas('institution', function ($institutionQuery) use ($search) {
                        $institutionQuery->where('name', 'LIKE', "%{$search}%");
                    })
                    ->orWhereHas('roles', function ($roleQuery) use ($search) {
                        $roleQuery->where('name', 'LIKE', "%{$search}%");
                    });
                });
            })
            ->paginate(10);

        return response()->json($users);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request, PasswordSetupService $passwordSetup): JsonResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validated();

        $user = User::create($data);

        $user->assignRole($request->role);

        $institution = $user->institution;
        if ($institution && $institution->type === 'MINISTRY' && $request->role === 'subject_officer') {
            if ($request->has('districts')) {
                foreach ($request->districts as $district) {
                    $user->districts()->create(['district' => $district]);
                }
            }
        }

        $smsSent = true;
        $message = 'User created. A password setup link was sent by SMS.';

        try {
            $passwordSetup->sendSetupLink($user);
        } catch (RuntimeException $exception) {
            report($exception);
            $smsSent = false;
            $message = 'User created, but the password setup SMS could not be sent. Check the mobile number and use resend.';
        }

        $user->setAttribute('setup_sms_sent', $smsSent);
        $user->setAttribute('message', $message);

        return response()->json($user->load(['institution', 'roles', 'districts']), 201);
    }

    public function resendPasswordSetup(Request $request, User $user, PasswordSetupService $passwordSetup): JsonResponse
    {
        $this->authorize('create', User::class);

        $key = 'password-setup-resend:'.$user->id;
        if (RateLimiter::tooManyAttempts($key, 1)) {
            return response()->json([
                'message' => 'Please wait '.RateLimiter::availableIn($key).' seconds before sending another setup link.',
            ], 429);
        }

        try {
            $passwordSetup->sendSetupLink($user);
        } catch (RuntimeException $exception) {
            report($exception);

            return response()->json([
                'message' => 'The password setup SMS could not be sent. Check the mobile number and try again.',
            ], 503);
        }

        RateLimiter::hit($key, config('password-setup.resend_cooldown_seconds'));

        return response()->json([
            'message' => 'A new password setup link was sent by SMS. Earlier unused links no longer work.',
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return User::with([
            'institution',
            'roles',
            'districts'
        ])->findOrFail($user->id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        $user->syncRoles($request->role);

        $institution = $user->institution;
        if ($institution && $institution->type === 'MINISTRY' && $request->role === 'subject_officer') {
            if ($request->has('districts')) {
                $user->districts()->delete();
                foreach ($request->districts as $district) {
                    $user->districts()->create(['district' => $district]);
                }
            } else {
                $user->districts()->delete();
            }
        } else {
            $user->districts()->delete();
        }

        return response()->json($user->load(['institution', 'roles', 'districts']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete', $user);

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }

    public function getAvailableDrivers(Request $request)
    {
       return User::role('driver')
        ->whereIn(
            'institution_id',
            app(InstitutionService::class)
                ->accessibleInstitutionIds($request->user())
        )
        ->orderBy('name')
        ->get();
    }
    
}
