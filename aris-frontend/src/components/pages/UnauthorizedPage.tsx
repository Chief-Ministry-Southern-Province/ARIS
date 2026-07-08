import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="max-w-lg w-full rounded-2xl bg-white shadow-xl border border-slate-200 p-10 text-center">

        {/* Icon */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">
          <ShieldAlert className="h-12 w-12 text-blue-700" />
        </div>

        {/* Status */}
        <p className="mt-8 text-sm font-semibold tracking-widest text-blue-700 uppercase">
          Error 403
        </p>

        {/* Title */}
        <h1 className="mt-3 text-3xl font-bold text-slate-800">
          Access Denied
        </h1>

        {/* Description */}
        <p className="mt-4 text-slate-600 leading-relaxed">
          You do not have permission to access this page.
          <br />
          Please contact your system administrator if you believe this is an
          error.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>

        </div>

        {/* Footer */}
        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            ARIS — Accident Reporting & Investigation System
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Provincial Department of Health Services
          </p>
        </div>
      </div>
    </div>
  );
}