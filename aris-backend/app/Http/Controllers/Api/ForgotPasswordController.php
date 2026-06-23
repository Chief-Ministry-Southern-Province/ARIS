<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Otp;
use App\Models\User;
use App\Services\TwilioService;

class ForgotPasswordController extends Controller
{
    public function sendOtp(Request $request, TwilioService $twilioService)
    {
        $request->validate([
            'nic' => 'required',
        ]);

       $user = User::where(
            'nic', $request->nic
        )->first();
       
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        $otp = rand(100000, 999999);

        Otp::create([
            'mobile' => $user->mobile,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);

        $phone = '+94' . ltrim(
            $user->mobile,
            '0'
        );

        $twilioService->sendOtp($phone, $otp);

        return response()->json([
            'message' => 'OTP sent successfully.'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'mobile' => 'required',
            'otp' => 'required',
        ]);

        $otpRecord = Otp::where([
            'mobile' => $request->mobile,
            'otp' => $request->otp,
            'is_used' => false,
        ])->first();

        if (!$otpRecord) {
            return response()->json([
                'message' => 'Invalid OTP.'
            ], 400);
        }

        if ($otpRecord->expires_at < now()) {
            return response()->json([
                'message' => 'OTP has expired.'
            ], 400);
        }

        $otpRecord->update(['is_used' => true]);

        return response()->json([
            'message' => 'OTP verified successfully.'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'mobile' => 'required',
            'otp' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        $otpRecord = Otp::where([
            'mobile' => $request->mobile,
            'otp' => $request->otp,
            'is_used' => false,
        ])->first();

        if (!$otpRecord) {
            return response()->json([
                'message' => 'Invalid OTP.'
            ], 400);
        }

        if ($otpRecord->expires_at < now()) {
            return response()->json([
                'message' => 'OTP has expired.'
            ], 400);
        }

        $user = User::where('mobile', $request->mobile)->first();
        if (!$user) {
            return response()->json([
                'message' => 'User not found.'
            ], 404);
        }

        $user->password = bcrypt($request->new_password);
        $user->save();

        $otpRecord->update(['is_used' => true]);

        return response()->json([
            'message' => 'Password reset successfully.'
        ]);
    }
}
