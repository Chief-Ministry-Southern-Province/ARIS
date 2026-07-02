<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request){

        $credentials = $request->validate([
            'nic' => ['required'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'role' => $user->getRoleNames(),
                'institutionType' => $user->institution->type ?? null,
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request){

        $request->user()
            ->currentAccessToken()
            ->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function profile(Request $request){
        return response()->json([
            'user' => $request->user()->load('institution'),
            'role' => $request->user()->getRoleNames(),
        ]);
    }

    public function updateProfile(Request $request){
        $user = $request->user();

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'nic' => 'sometimes|required|string|max:20|unique:users,nic,' . $user->id,
            'mobile' => 'sometimes|required|string|max:15',
            'password' => 'sometimes|required|string|min:8|confirmed',
        ]);

        if (isset($validatedData['password'])) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        }

        $user->update($validatedData);

        return response()->json(['message' => 'Profile updated successfully', 'user' => $user]);
    }

    public function changePassword(Request $request){

        $user = $request->user();

        $validatedData = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json(['message' => 'Current password is incorrect'], 400);
        }

        $user->password = Hash::make($validatedData['new_password']);
        $user->save();

        return response()->json(['message' => 'Password changed successfully']);
    }

}
