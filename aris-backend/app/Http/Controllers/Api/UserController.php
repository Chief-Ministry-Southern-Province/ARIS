<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Services\InstitutionService;
use Illuminate\Support\Facades\Hash;

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

        $users = User::with(['institution', 'roles'])
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
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        $user->assignRole($request->role);

        return response()->json($user, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return User::with([
            'institution',
            'roles'
        ])->findOrFail($user->id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $user->update($request->validated());
        $user->syncRoles($request->role);

        return response()->json($user);
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
