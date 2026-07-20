import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, getProfile, login, logout, resetPassword, sendOtp, verifyOtp } from "@/services/auth.service";
import { queryKeys } from "@/hooks/queryKeys";

const profileKey = queryKeys.auth.profile;

const errorMessage = (error: unknown) =>
  (error as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Request failed";

export const useProfile = () => useQuery({
  queryKey: profileKey,
  queryFn: getProfile,
  retry: false,
});

export const useLogin = () => {
  const mutation = useMutation({
    mutationFn: ({ nic, password }: { nic: string; password: string }) => login(nic, password),
  });

  return {
    loginUser: async (nic: string, password: string, rememberMe: boolean) => {
      const response = await mutation.mutateAsync({ nic, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("institutionType", response.institutionType ?? "");
      localStorage.setItem("id", String(response.id));
      if (response.name) localStorage.setItem("name", response.name);
      if (response.role) localStorage.setItem("role", JSON.stringify(response.role));
      if (rememberMe) localStorage.setItem("rememberedUsername", nic);
      else localStorage.removeItem("rememberedUsername");
      return response;
    },
    loading: mutation.isPending,
    error: mutation.error ? errorMessage(mutation.error) : "",
  };
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
  });
  return { logoutUser: mutation.mutateAsync, loading: mutation.isPending, error: mutation.error ? errorMessage(mutation.error) : "" };
};

export const useChangePassword = () => {
  const mutation = useMutation({
    mutationFn: ({ current_password, new_password, new_password_confirmation }: { current_password: string; new_password: string; new_password_confirmation: string }) =>
      changePassword(current_password, new_password, new_password_confirmation),
  });
  return {
    changePasswordUser: (current_password: string, new_password: string, new_password_confirmation: string) =>
      mutation.mutateAsync({ current_password, new_password, new_password_confirmation }),
    loading: mutation.isPending,
    error: mutation.error ? errorMessage(mutation.error) : "",
  };
};

export const useSendOtp = () => {
  const mutation = useMutation({ mutationFn: (nic: string) => sendOtp(nic) });
  return { sendOtpUser: mutation.mutateAsync, loading: mutation.isPending, error: mutation.error ? errorMessage(mutation.error) : "" };
};
export const useVerifyOtp = () => {
  const mutation = useMutation({ mutationFn: ({ mobile, otp }: { mobile: string; otp: string }) => verifyOtp(mobile, otp) });
  return { verifyOtpUser: (mobile: string, otp: string) => mutation.mutateAsync({ mobile, otp }), loading: mutation.isPending, error: mutation.error ? errorMessage(mutation.error) : "" };
};
export const useResetPassword = () => {
  const mutation = useMutation({ mutationFn: ({ mobile, otp, new_password, new_password_confirmation }: { mobile: string; otp: string; new_password: string; new_password_confirmation: string }) => resetPassword(mobile, otp, new_password, new_password_confirmation) });
  return { resetPasswordUser: (mobile: string, otp: string, new_password: string, new_password_confirmation: string) => mutation.mutateAsync({ mobile, otp, new_password, new_password_confirmation }), loading: mutation.isPending, error: mutation.error ? errorMessage(mutation.error) : "" };
};
