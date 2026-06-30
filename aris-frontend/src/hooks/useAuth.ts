import { useState } from "react";
import { login, logout,changePassword,sendOtp,verifyOtp,resetPassword} from "@/services/auth.service";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loginUser = async (nic: string,password: string,rememberMe: boolean) => {
    try {
      setLoading(true);
      setError("");

      const response = await login(nic, password);

      localStorage.setItem("token", response.token);

      if (response.role) {
        localStorage.setItem(
          "role",
          JSON.stringify(response.role)
        );
      }

      if (rememberMe) {
        localStorage.setItem("rememberedUsername", nic);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      return response;
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Login failed";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loginUser,
    loading,
    error,
  };
};

export const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logoutUser = async () => {
    try {
      setLoading(true);
      setError("");

      await logout();

      localStorage.removeItem("token");
      localStorage.removeItem("role");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Logout failed";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
    
  }
  return{
      logoutUser,
      loading,
      error
    }
};
export const useChangePassword = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const changePasswordUser = async (current_password: string, new_password: string, new_password_confirmation: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await changePassword(current_password, new_password, new_password_confirmation);

      return response;
      
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Change password failed";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePasswordUser,
    loading,
    error,
  };
};



export const useSendOtp = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOtpUser = async (nic: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await sendOtp(nic);

      return response;
      
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Send OTP failed";    
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendOtpUser,
    loading,
    error,
  };
};

export const useVerifyOtp = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyOtpUser = async (mobile: string, otp: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await verifyOtp(mobile, otp);

      return response;
      
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Verify OTP failed";    
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    verifyOtpUser,
    loading,
    error,
  };
};

export const useResetPassword = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPasswordUser = async (mobile: string, otp: string, new_password: string, new_password_confirmation: string) => {
    try {
      setLoading(true);
      setError("");

      const response = await resetPassword(mobile, otp, new_password, new_password_confirmation);

      return response;
      
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Reset password failed";    
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    resetPasswordUser,
    loading,
    error,
  };
};