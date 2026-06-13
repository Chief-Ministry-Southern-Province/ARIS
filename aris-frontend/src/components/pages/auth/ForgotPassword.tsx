import { useState } from "react";
import { ArrowLeft, Mail, Shield, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setLoading(false);
    setSuccess(true);
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
            Enter your registered email address
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <CheckCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />

              <h3 className="font-semibold text-green-700">
                Reset Link Sent
              </h3>

              <p className="text-sm text-green-600 mt-2">
                Please check your email inbox.
              </p>

              <button
                onClick={() => navigate("/login")}
                className="mt-5 text-blue-700 font-medium"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleReset}>
              <div className="relative mb-6">
                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold bg-linear-to-r from-blue-700 to-blue-500"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <button
            onClick={() => navigate("/login")}
            className="mt-6 flex items-center justify-center gap-2 w-full text-gray-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}