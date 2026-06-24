import { useState } from "react";
import { login } from "@/services/authService";

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