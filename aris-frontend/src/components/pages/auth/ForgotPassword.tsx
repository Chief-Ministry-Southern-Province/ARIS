import { useState } from "react";
import {Shield,User,Smartphone,Lock,CheckCircle,} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSendOtp,useVerifyOtp,useResetPassword } from "@/hooks/useAuth";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [nic, setNic] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const { sendOtpUser, error: sendOtpError } = useSendOtp();
  const { verifyOtpUser, error: verifyOtpError } = useVerifyOtp();
  const { resetPasswordUser, error: resetPasswordError } = useResetPassword();

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await sendOtpUser(nic);

      toast.success(
        response?.data?.message ||
          "OTP sent successfully"
      );

      if (response?.data?.mobile) {
        setMobile(response.data.mobile);
      }

      setStep(2);
    } catch (error) {
      console.error(error);

      toast.error(
        sendOtpError || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      await verifyOtpUser(
        mobile,
        otp
      );

      toast.success(
        "OTP verified successfully"
      );

      setStep(3);
    } catch (error) {
      console.error(error);

      toast.error(
        verifyOtpError || "Invalid OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      newPassword !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match"
      );
      return;
    }

    try {
      setLoading(true);

      await resetPasswordUser(
        mobile,
        otp,
        newPassword,
        confirmPassword
      );

      toast.success(
        "Password reset successfully"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      toast.error(
        resetPasswordError ||
          "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(135deg,#0F2460 0%,#1E40AF 60%,#2563EB 100%)",
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900">
            Forgot Password
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Reset your account password
          </p>

          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                  ${
                    step >= item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > item ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    item
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={sendOtp}>
              <div className="relative mb-6">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  required
                  value={nic}
                  onChange={(e) =>
                    setNic(e.target.value)
                  }
                  placeholder="Enter NIC"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500"
              >
                {loading
                  ? "Sending OTP..."
                  : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={verifyOtp}>
              <div className="relative mb-4">
                <Smartphone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  required
                  value={mobile}
                  onChange={(e) =>
                    setMobile(
                      e.target.value
                    )
                  }
                  placeholder="Mobile Number"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative mb-6">
                <Shield className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) =>
                    setOtp(
                      e.target.value
                    )
                  }
                  placeholder="Enter OTP"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={resetPassword}>
              <div className="relative mb-4">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="New Password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative mb-6">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm Password"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-700 to-blue-500"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          )}

          <button
            onClick={() =>
              navigate("/login")
            }
            className="mt-6 w-full text-center text-gray-500 hover:text-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}