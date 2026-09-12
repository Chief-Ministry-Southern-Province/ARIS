import { CheckCircle, Lock, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { completePasswordSetup, validatePasswordSetupToken } from "@/services/passwordSetup.service";

const errorMessage = (error: unknown): string =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message
  || "This password setup link is not valid.";

export default function SetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get("token") || "";
  const [validating, setValidating] = useState(true);
  const [linkError, setLinkError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setLinkError("This password setup link is invalid.");
      setValidating(false);
      return;
    }

    validatePasswordSetupToken(token)
      .catch((error) => setLinkError(errorMessage(error)))
      .finally(() => setValidating(false));
  }, [token]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmation) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await completePasswordSetup(token, password, confirmation);
      toast.success(response.message);
      navigate("/login", { replace: true });
    } catch (error) {
      const message = errorMessage(error);
      setLinkError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-950 via-blue-800 to-blue-600 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl dark:bg-slate-900">
        <div className="mb-6 flex items-center gap-3 text-blue-800 dark:text-blue-300">
          <Lock className="h-7 w-7" />
          <div><h1 className="text-xl font-bold">Set your ARIS password</h1><p className="text-sm text-gray-600 dark:text-slate-400">Create a secure password for your account.</p></div>
        </div>

        {validating ? <p className="text-sm text-gray-600">Checking your secure link…</p> : linkError ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"><ShieldAlert className="mr-2 inline h-4 w-4" />{linkError}</div>
            <p className="text-sm text-gray-600">Ask your administrator to send a new password setup link.</p>
            <button onClick={() => navigate("/login")} className="text-sm font-medium text-blue-700 hover:underline">Back to login</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">New password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={12} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900" />
            </label>
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-200">Confirm password
              <input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required minLength={12} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900" />
            </label>
            <p className="text-xs text-gray-500">Use at least 12 characters, including upper- and lower-case letters, a number, and a symbol.</p>
            <button type="submit" disabled={submitting} className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-60">{submitting ? "Saving password…" : "Set password"}</button>
            <p className="flex items-center justify-center gap-1 text-xs text-green-700"><CheckCircle className="h-3.5 w-3.5" />This link can be used once.</p>
          </form>
        )}
      </div>
    </div>
  );
}
