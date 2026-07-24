import  { useState } from "react";
import {Shield,Eye,EyeOff,Globe,Lock,User,AlertCircle,CheckCircle} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {useLogin} from "@/hooks/useAuth"
import { toast } from "react-toastify";
import {useAuth} from "@/context/auth/AuthContext";

function Login() {

  const {user} = useAuth();

  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const savedUsername = localStorage.getItem("rememberedUsername") || "";

  const [username, setUsername] = useState(savedUsername);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(savedUsername));
  const [capsLock, setCapsLock] = useState(false);

  const onLanguageChange = (lang: "en" | "si") => {
    i18n.changeLanguage(lang);
  };

  const {loginUser,loading,error} = useLogin();

 const handleLogin = async (e: React.FormEvent) => {
  
    e.preventDefault();
    
    try {

      const response = await loginUser(username, password, rememberMe);
      user(response.token, response.role);

      toast.success("Login successful");

      if (response.role.includes("system_admin")) {
        navigate("/admin");
      } else if( response.role.includes("driver") ) {
        navigate("/report");
      }else{
        navigate("/dashboard");
      }

    } 
    catch (err: unknown) {
      console.log(err);
      toast.error("Invalid username or password");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row"
      style={{
        background:
          "linear-gradient(135deg,#0B1F52 0%,#123A8D 55%,#1E5FE0 100%)",
      }}
    >
      {/* LEFT PANEL */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-blue-200 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>

            <div>
              <h2 className="text-5xl font-black tracking-wider">
                ARIS
              </h2>

              <p className="text-blue-100 text-sm uppercase tracking-[0.3em] mt-2">
                Government Platform
              </p>
            </div>
          </div>

          <h1 className="text-6xl font-extrabold leading-tight mb-6">
            Accident Reporting
            <br />
            <span className="text-yellow-400">& Investigation</span>
            <br />
            System
          </h1>

          <p className="text-xl text-blue-100 leading-relaxed mb-10">
            Secure digital platform for accident reporting,
            investigations, approvals, evidence management,
            and inter-agency collaboration.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <h3 className="text-3xl font-bold">24/7</h3>
              <p className="text-sm text-blue-100 mt-1">
                System Availability
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5">
              <h3 className="text-3xl font-bold">100%</h3>
              <p className="text-sm text-blue-100 mt-1">
                Secure Access
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* MOBILE HEADER */}
          <div className="lg:hidden text-center mb-8 text-white">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4">
              <Shield className="w-10 h-10" />
            </div>

            <h1 className="text-4xl font-black">
              ARIS
            </h1>

            <p className="text-blue-100 mt-2 text-sm">
              Accident Reporting & Investigation System
            </p>
          </div>

          {/* LOGIN CARD */}
          <div className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] overflow-hidden">
            {/* CARD HEADER */}
            <div className="bg-linear-to-r from-blue-900 to-blue-700 px-8 py-6 text-white">
              <h2 className="text-2xl font-bold">
                {t("login.login")}
              </h2>

              <p className="text-blue-100 text-sm mt-1">
                Access the ARIS Government Portal
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {/* LANGUAGE */}
              <div className="flex justify-end mb-6">
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <Globe className="w-4 h-4 text-gray-500 ml-2" />

                  <button
                    onClick={() => onLanguageChange("en")}
                    className={`px-3 py-1.5 text-xs rounded-lg transition ${
                      i18n.language === "en"
                        ? "bg-blue-700 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    EN
                  </button>

                  <button
                    onClick={() => onLanguageChange("si")}
                    className={`px-3 py-1.5 text-xs rounded-lg transition ${
                      i18n.language === "si"
                        ? "bg-blue-700 text-white"
                        : "text-gray-600"
                    }`}
                  >
                    සිං
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />

                  <span className="text-sm text-red-700">
                    {error}
                  </span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* USERNAME */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    {t("login.username")}
                  </label>

                  <div className="relative mt-2">
                    <User className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

                    <input
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition"
                      placeholder={t("login.username_placeholder")}
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    {t("login.password")}
                  </label>

                  <div className="relative mt-2">
                    <Lock className="absolute left-3 top-4 w-4 h-4 text-gray-400" />

                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      onKeyUp={(e) =>
                        setCapsLock(
                          e.getModifierState("CapsLock")
                        )
                      }
                      className="w-full pl-10 pr-10 py-3.5 rounded-xl border-2 border-gray-200 focus:border-blue-600 outline-none transition"
                      placeholder={t("login.password_placeholder")}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-3.5"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-500" />
                      )}
                    </button>
                  </div>

                  {capsLock && (
                    <p className="text-xs text-amber-600 mt-2">
                      Caps Lock is ON
                    </p>
                  )}
                </div>

                {/* OPTIONS */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() =>
                        setRememberMe(!rememberMe)
                      }
                    />

                    {t("login.rememberMe")}
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/forgot-password")
                    }
                    className="text-sm text-blue-700 font-medium hover:underline text-left sm:text-right"
                  >
                    {t("login.forgotPassword")}
                  </button>
                </div>

                {/* LOGIN BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white font-semibold bg-linear-to-r from-blue-800 to-blue-600 hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-70"

                >
                  {loading
                    ? t("login.signingIn")
                    : t("login.login")}
                </button>
              </form>

              {/* SECURITY */}
              <div className="mt-8 border-t pt-6">
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />

                  <span className="text-xs font-medium">
                    Secure Encrypted Connection
                  </span>
                </div>

                <div className="flex justify-center mt-4">
                  <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    Government Secure Network
                  </span>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4">
                  Version 2.4.1
                </p>
              </div>
            </div>
          </div>

          {/* MOBILE FOOTER */}
          <p className="lg:hidden text-center text-white/70 text-xs mt-4">
            © 2026 ARIS Government Platform
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
